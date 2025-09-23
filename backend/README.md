# Hospital Management System - Backend

## Environment Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Firebase project with Authentication enabled
- Gmail account with App Password (for email service)

### Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure the following environment variables in `.env`:**

   **Firebase Setup:**
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Your Firebase service account key (JSON format)

   **Email Service:**
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Gmail App Password (not regular password)
   
   To get Gmail App Password:
   1. Enable 2-Factor Authentication on your Google account
   2. Go to Google Account Settings → Security → App passwords
   3. Generate an App Password for "Mail"

   **Database:**
   - `MONGODB_URL`: Your MongoDB connection string

### Security Notes

⚠️ **IMPORTANT**: The `.env` file contains sensitive information and is excluded from Git tracking for security reasons.

- Never commit the actual `.env` file to version control
- Use `.env.example` as a template for team members
- Keep your Firebase service account key secure
- Use Gmail App Passwords, not your regular Gmail password

### Features

- **Firebase Authentication Integration**
- **OTP-based Email Verification**
- **Users inactive by default until email verified**
- **Professional email templates**
- **Rate limiting on OTP requests**
- **Comprehensive security measures**

### API Endpoints

```
POST /auth/signup         - Register new user + send OTP
POST /auth/login          - Login with Firebase token
POST /auth/verify-otp     - Verify OTP and activate account
POST /auth/resend-otp     - Resend OTP with rate limiting
GET  /auth/profile        - Get user profile (authenticated)
```

### Installation

```bash
npm install
npm run dev
```

The server will start on `http://localhost:5000`