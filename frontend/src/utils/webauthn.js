// WebAuthn utility helpers
// Assumptions: backend exposes the following endpoints:
// 1. POST /webauthn/register/options  -> returns PublicKeyCredentialCreationOptions (JSON) { publicKey: { ... } }
// 2. POST /webauthn/register/verify   -> body: { id, rawId, response, type, clientExtensionResults } returns success
// 3. POST /webauthn/login/options     -> returns PublicKeyCredentialRequestOptions (JSON) { publicKey: { ... } }
// 4. POST /webauthn/login/verify      -> body: { id, rawId, response, type, clientExtensionResults } returns session / tokens
// Adjust the paths to match your backend implementation.

import api from '../config/api';

// Base64URL <-> ArrayBuffer helpers
export function base64urlToArrayBuffer(value) {
  if (!value || typeof value !== 'string') {
    throw new Error('Invalid base64url input (empty or non-string)');
  }
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const b64 = (value.replace(/-/g, '+').replace(/_/g, '/')) + padding;
  const raw = atob(b64);
  const outputArray = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) outputArray[i] = raw.charCodeAt(i);
  return outputArray.buffer;
}

export function arrayBufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function transformCreationOptions(pubKeyOpts) {
  if (!pubKeyOpts) throw new Error('Missing creation options object');
  if (!pubKeyOpts.challenge) throw new Error('Malformed creation options: missing challenge');
  if (!pubKeyOpts.user || !pubKeyOpts.user.id) throw new Error('Malformed creation options: missing user.id');
  return {
    ...pubKeyOpts,
    challenge: base64urlToArrayBuffer(pubKeyOpts.challenge),
    user: {
      ...pubKeyOpts.user,
      id: base64urlToArrayBuffer(pubKeyOpts.user.id)
    },
    excludeCredentials: (pubKeyOpts.excludeCredentials || []).map(c => {
      if (!c.id) throw new Error('Malformed excludeCredentials entry: missing id');
      return { ...c, id: base64urlToArrayBuffer(c.id) };
    })
  };
}

// Dev-only helper to fabricate minimal valid creation options when backend not ready
function devMockCreationOptions(payload = {}) {
  const rand = (len = 32) => {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    let bin = '';
    bytes.forEach(b => bin += String.fromCharCode(b));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const userId = rand(16);
  return {
    challenge: rand(32),
    rp: { name: 'Dev Mock RP', id: window.location.hostname },
    user: {
      id: userId,
      name: payload.email || 'dev@example.com',
      displayName: payload.username || payload.email || 'Dev User'
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },
      { type: 'public-key', alg: -257 }
    ],
    timeout: 60000,
    attestation: 'none',
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' }
  };
}

function transformRequestOptions(pubKeyOpts) {
  if (!pubKeyOpts || !pubKeyOpts.challenge) {
    throw new Error('Malformed WebAuthn request options: missing challenge');
  }
  return {
    ...pubKeyOpts,
    challenge: base64urlToArrayBuffer(pubKeyOpts.challenge),
    allowCredentials: (pubKeyOpts.allowCredentials || []).map(c => {
      if (!c.id) throw new Error('Malformed allowCredentials entry: missing id');
      return { ...c, id: base64urlToArrayBuffer(c.id) };
    })
  };
}

function packCredential(cred) {
  return {
    id: cred.id,
    rawId: arrayBufferToBase64url(cred.rawId),
    type: cred.type,
    response: {
      clientDataJSON: arrayBufferToBase64url(cred.response.clientDataJSON),
      attestationObject: cred.response.attestationObject ? arrayBufferToBase64url(cred.response.attestationObject) : undefined,
      authenticatorData: cred.response.authenticatorData ? arrayBufferToBase64url(cred.response.authenticatorData) : undefined,
      signature: cred.response.signature ? arrayBufferToBase64url(cred.response.signature) : undefined,
      userHandle: cred.response.userHandle ? arrayBufferToBase64url(cred.response.userHandle) : undefined
    },
    clientExtensionResults: cred.getClientExtensionResults?.() || {}
  };
}

export async function isWebAuthnAvailable() {
  return !!(window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function');
}

// Registration (during or after signup)
export async function beginRegistration(payload = {}) {
  const { data } = await api.post('/webauthn/register/options', payload);
  if (!data) throw new Error('Empty response from register/options');
  const raw = data.publicKey || data;
  console.debug('[WebAuthn] Registration options raw response', raw);
  let publicKey;
  try {
    // If malformed and in dev mode, optionally fabricate mock options for easier local testing
    if ((!raw || !raw.challenge) && import.meta?.env?.DEV) {
      console.warn('[WebAuthn] Backend registration options missing challenge; using DEV MOCK options (DO NOT USE IN PROD)');
      const mock = devMockCreationOptions(payload);
      publicKey = transformCreationOptions(mock);
    } else {
      publicKey = transformCreationOptions(raw);
    }
  } catch (e) {
    throw new Error('Failed to parse registration options: ' + e.message);
  }
  const credential = await navigator.credentials.create({ publicKey });
  return packCredential(credential);
}

export async function finishRegistration(credential) {
  return api.post('/webauthn/register/verify', credential);
}

// Login (assertion)
export async function beginLogin(payload = {}) {
  const { data } = await api.post('/webauthn/login/options', payload);
  if (!data) throw new Error('Empty response from login/options');
  let raw = data.publicKey || data;
  try {
    const publicKey = transformRequestOptions(raw);
    const assertion = await navigator.credentials.get({ publicKey });
    return packCredential(assertion);
  } catch (e) {
    // Re-throw with clearer context
    throw new Error('Failed to parse authentication options: ' + e.message);
  }
}

export async function finishLogin(assertion) {
  return api.post('/webauthn/login/verify', assertion);
}

export function mapWebAuthnError(err) {
  if (!err || !err.name) return 'Unknown error';
  switch (err.name) {
    case 'NotAllowedError':
      return 'Action timed out or was cancelled.';
    case 'InvalidStateError':
      return 'Credential already registered or in invalid state.';
    case 'SecurityError':
      return 'Security context error (insecure origin?).';
    case 'AbortError':
      return 'Operation aborted.';
    default:
      return err.message || 'Unexpected WebAuthn error';
  }
}
