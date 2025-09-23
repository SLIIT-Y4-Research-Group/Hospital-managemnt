# Firebase Authentication Migration Guide

## Overview
The Hospital Management System has been migrated from custom JWT authentication to Firebase Authentication for enhanced security and features.

## Setup Instructions

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication service
4. In Authentication > Sign-in method, enable Email/Password
5. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### 2. Environment Configuration
Create a `.env` file in the backend root directory:
```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}
```

### 3. Client-Side Changes Required
The client application needs to integrate Firebase Client SDK:

```bash
npm install firebase
```

## API Changes

### Authentication Endpoints

#### 1. Signup (Server-side user creation)
**POST** `/api/auth/signup`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "contactNumber": "1234567890",
  "address": "123 Main St",
  "role": "patient"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "customToken": "firebase-custom-token",
  "user": {
    "id": "mongodb-user-id",
    "firebaseUID": "firebase-uid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### 2. Login (Token verification)
**POST** `/api/auth/login`

```json
{
  "idToken": "firebase-id-token-from-client"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "customToken": "firebase-custom-token",
  "user": {
    "id": "mongodb-user-id",
    "firebaseUID": "firebase-uid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "contactNumber": "1234567890",
    "address": "123 Main St"
  }
}
```

#### 3. Logout
**POST** `/api/auth/logout`

```json
{
  "firebaseUID": "firebase-user-id"
}
```

#### 4. Get Profile (Protected)
**GET** `/api/auth/profile`
**Headers:** `Authorization: Bearer <firebase-id-token>`

#### 5. Update Profile (Protected)
**PUT** `/api/auth/profile`
**Headers:** `Authorization: Bearer <firebase-id-token>`

```json
{
  "username": "updated_name",
  "contactNumber": "new-phone",
  "address": "new-address"
}
```

## Client-Side Integration Example

### 1. Initialize Firebase (Client)
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 2. User Registration Flow
```javascript
import { signInWithCustomToken } from 'firebase/auth';

// 1. Register user on server
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'patient'
  })
});

const data = await response.json();

// 2. Sign in with custom token
if (data.customToken) {
  await signInWithCustomToken(auth, data.customToken);
}
```

### 3. User Login Flow
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

// 1. Sign in with Firebase
const userCredential = await signInWithEmailAndPassword(auth, email, password);

// 2. Get ID token
const idToken = await userCredential.user.getIdToken();

// 3. Send to server for profile data
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken })
});
```

### 4. Making Authenticated Requests
```javascript
// Get current user's ID token
const idToken = await auth.currentUser.getIdToken();

// Make authenticated request
const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  }
});
```

## Middleware Usage

### Protecting Routes
```javascript
import { authenticateToken, authorizeRole, adminOnly } from '../middleware/authMiddleware.js';

// Require authentication
router.get('/protected', authenticateToken, handler);

// Require specific role
router.get('/admin-only', authenticateToken, adminOnly, handler);

// Require one of multiple roles
router.get('/doctor-or-admin', authenticateToken, authorizeRole('doctor', 'admin'), handler);
```

## Security Benefits
- ✅ Secure password handling by Firebase
- ✅ Built-in email verification
- ✅ Advanced security features (MFA, etc.)
- ✅ Token refresh handled by Firebase
- ✅ No more hardcoded JWT secrets
- ✅ Role-based access control maintained
- ✅ Automatic token expiration and refresh

## Migration Checklist
- [x] Install Firebase Admin SDK
- [x] Configure Firebase project
- [x] Update User model with Firebase UID
- [x] Migrate authentication controller
- [x] Create authentication middleware
- [x] Update routes with new endpoints
- [ ] Update client-side authentication
- [ ] Test all authentication flows
- [ ] Deploy with proper environment variables

## Troubleshooting

### Common Issues
1. **Invalid service account**: Ensure the service account JSON is properly formatted
2. **Token verification fails**: Check if the ID token is being sent correctly
3. **User not found**: Make sure user registration creates both Firebase and MongoDB records

### Firebase Errors
- `auth/email-already-exists`: User already registered
- `auth/invalid-email`: Email format is invalid
- `auth/weak-password`: Password doesn't meet requirements
- `auth/id-token-expired`: Client needs to refresh token