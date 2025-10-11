# WebAuthn / Passkey Integration Spec

This document defines the expected frontend <-> backend contract for the passkey (WebAuthn) feature added to the React application.

## Overview
After a traditional email+password signup/login, users can register a passkey (public-key credential) and subsequently authenticate with it. Passkeys allow biometric / device-based authentication via the WebAuthn standard.

## Security & Transport
- All endpoints MUST be served over HTTPS in production.
- Set appropriate `Content-Security-Policy` and enable `SameSite` & `HttpOnly` for session cookies if used.
- Never store raw credential private keys server-side (the authenticator keeps them). Store only the public key and metadata returned in attestation / assertion verification.

## Data Encoding
The frontend encodes binary credential fields to Base64URL (no padding, `-` and `_` replacements). The backend must accept and return Base64URL strings for binary fields.

## Endpoints
### 1. Begin Registration
`POST /webauthn/register/options`

Request body (example):
```json
{
  "email": "user@example.com",
  "displayName": "User Name"
}
```
- `email` may be used to look up existing account (user must already be authenticated OR you associate the challenge with the pending signup session).

Response (PublicKeyCredentialCreationOptions-like wrapper):
```json
{
  "publicKey": {
    "challenge": "<base64url>",
    "rp": { "name": "Hospital App", "id": "example.com" },
    "user": {
      "id": "<base64url-user-id>",
      "name": "user@example.com",
      "displayName": "User Name"
    },
    "pubKeyCredParams": [ { "type": "public-key", "alg": -7 }, { "type": "public-key", "alg": -257 } ],
    "timeout": 60000,
    "attestation": "none",
    "excludeCredentials": [ { "type": "public-key", "id": "<base64url-existing-cred-id>" } ],
    "authenticatorSelection": { "residentKey": "preferred", "userVerification": "preferred" }
  }
}
```

### 2. Finish Registration
`POST /webauthn/register/verify`

Request body (attestation result):
```json
{
  "id": "<credentialId>",
  "rawId": "<base64url>",
  "type": "public-key",
  "response": {
    "clientDataJSON": "<base64url>",
    "attestationObject": "<base64url>"
  },
  "clientExtensionResults": {}
}
```

Server actions:
1. Look up pending challenge for user.
2. Verify attestation (challenge, origin, RP ID hash, token binding, etc.).
3. Extract credential public key + signCount / aaguid.
4. Persist credential record:
   - userId
   - credentialId
   - publicKey
   - signCount (initial)
   - transports (if provided)
   - createdAt

Success response:
```json
{ "success": true }
```

### 3. Begin Login (Assertion Options)
`POST /webauthn/login/options`

Request body (optional):
```json
{ "email": "user@example.com" }
```
- If email supplied, you may narrow allowed credentials. If not, and you support discoverable credentials (resident keys), allow empty `allowCredentials` so the authenticator chooses.

Response:
```json
{
  "publicKey": {
    "challenge": "<base64url>",
    "timeout": 60000,
    "rpId": "example.com",
    "allowCredentials": [
      { "type": "public-key", "id": "<base64url-cred-id>", "transports": ["internal"] }
    ],
    "userVerification": "preferred"
  }
}
```

### 4. Finish Login (Assertion Verify)
`POST /webauthn/login/verify`

Request body:
```json
{
  "id": "<credentialId>",
  "rawId": "<base64url>",
  "type": "public-key",
  "response": {
    "clientDataJSON": "<base64url>",
    "authenticatorData": "<base64url>",
    "signature": "<base64url>",
    "userHandle": "<base64url-optional>"
  },
  "clientExtensionResults": {}
}
```

Verification steps:
1. Locate credential by `id`.
2. Recompute challenge, verify it matches stored challenge.
3. Validate clientData.origin, type == `webauthn.get`.
4. Parse authenticatorData: check RP ID hash, flags (UP, UV if required), signature counter progression.
5. Verify signature over `authenticatorData || SHA256(clientDataJSON)` using stored public key.
6. Update signCount if larger than stored (else potential clone detection).
7. Issue session / JWT same as password login.

Success response (example, aligning with existing login shape):
```json
{
  "user": { "id": "<uuid>", "email": "user@example.com", "role": "patient" },
  "token": "<jwt-or-session-cookie>"
}
```

## Error Conventions
Return consistent JSON errors:
```json
{ "error": "invalid_challenge" }
```
Common server error codes:
- `invalid_challenge`
- `credential_not_found`
- `assertion_signature_invalid`
- `attestation_invalid`
- `origin_mismatch`

Frontend maps WebAuthn DOM exceptions via `mapWebAuthnError()`.

## Database Model (Suggested)
`users` table: id, email, displayName, passwordHash, ...
`webauthn_credentials` table:
- id (uuid)
- userId (FK)
- credentialId (string, base64url)
- publicKey (PEM / COSE key bytes encoded base64url)
- signCount (int)
- transports (json array)
- createdAt / updatedAt

## Security Notes
- Enforce HTTPS & HSTS.
- Use RP ID matching effective domain (no stray subdomain mismatches).
- Consider enforcing `userVerification: required` for higher assurance.
- Rate-limit registration & assertion attempts.
- Clear pending challenges after single use (store with short TTL).

## Frontend Flow Summary
1. User logs in (password) OR completes signup.
2. User clicks “Register Passkey” -> frontend calls `/webauthn/register/options` then `navigator.credentials.create()` then `/webauthn/register/verify`.
3. On future visits user clicks “Login with Passkey” -> `/webauthn/login/options` -> `navigator.credentials.get()` -> `/webauthn/login/verify` -> store session / context.

## Browser Support
- Modern Chromium, Safari, Firefox (latest) support WebAuthn / passkeys.
- Feature detection already guards UI: `window.PublicKeyCredential`.

## Future Enhancements
- Support device-bound vs synced (discoverable) credentials reporting.
- Show a list of registered devices / allow revocation.
- Enforce re-auth for sensitive operations.
