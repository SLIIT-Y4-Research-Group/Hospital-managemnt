# Hospital Management Frontend (React + Vite)

## Overview
React 18 + Vite application with centralized API config, OTP flow, and optional WebAuthn (passkey / biometric) authentication.

## Development
Install dependencies and start dev server:

```
npm install
npm run dev
```

## Centralized API
All HTTP calls use the axios instance in `src/config/api.js` (base URL & interceptors). Avoid hardcoding absolute backend URLs in components.

## Authentication
- Traditional email/password login (`/api/auth/login`)
- Optional OTP verification (where implemented)
- Passkey (WebAuthn) registration after signup and login via "Login with Passkey" button.

## Passkey / WebAuthn
The passkey feature lets users register a device-based credential and authenticate without typing a password.

Key files:
- `src/utils/webauthn.js`: Helper functions (begin/finish registration & login, base64url transforms, error mapping)
- `src/components/Signup.jsx`: Offers passkey registration after successful signup
- `src/components/Login.jsx`: Adds "Login with Passkey" button (hidden if unsupported)

Backend contract details: `docs/WEB_AUTHN.md`

### Browser / Platform Notes
- Requires secure context (HTTPS) in production.
- Feature detection: UI only shown if `window.PublicKeyCredential` exists.
- On unsupported browsers the password flow remains unchanged.

### Manual Test Checklist
1. Signup with email/password.
2. Choose "Register Passkey"; biometric prompt should appear.
3. Refresh page; use "Login with Passkey" to authenticate.
4. Cancel prompt -> receive friendly error (NotAllowedError mapping).
5. Re-register same passkey -> server should exclude credential (no duplicate).
6. Attempt passkey login on different browser without synced credential -> expect failure or hidden button.

### Security Considerations
- Server must verify challenges and origins, store only public key and metadata.
- Enforce HTTPS, set HSTS, and clear challenges after single use.
- Consider `userVerification: required` for higher assurance operations.

## Scripts
Common commands:

```
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview built app
```

## License
Internal / Academic use (adjust as needed).
