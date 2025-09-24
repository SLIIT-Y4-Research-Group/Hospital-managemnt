// config.js
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/* ------------ Runtime ------------ */
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;

/* ------------ CORS / Frontend origin ------------ */
// Must match the browser origin exactly (scheme + host + port)
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// If frontend and backend are on different sites (e.g. Render + Vercel),
// cookies must be SameSite=None; Secure=true.
export const CROSS_SITE = !FRONTEND_URL.includes('localhost');

/* ------------ MongoDB ------------ */
export const mongoDBURL =
  process.env.MONGODB_URL ||
  'mongodb+srv://Dhanuka:20020502@mernapp.emyz11d.mongodb.net/?retryWrites=true&w=majority&appName=MERNApp';

/* ------------ Payments ------------ */
export const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ||
  'sk_test_51Q9OJEP8uKMsK9jbYFLuxJ8SVKIzpoDvkbNbPYa7kPV2cDJzSDcywn3vNdD1XXO9fhMA2DYVuCEXPyNo2TxyzNIj00FhKMukLW';

/* ------------ Firebase ------------ */
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
export const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

/* ------------ CSRF cookie helpers (optional) ------------ */
// Use these in index.js when creating cookies for csurf and XSRF mirror.
export const CSRF_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: CROSS_SITE ? 'None' : 'Lax',
  secure: CROSS_SITE,
  path: '/',
};

export const XSRF_MIRROR_COOKIE_OPTIONS = {
  sameSite: CROSS_SITE ? 'None' : 'Lax',
  secure: CROSS_SITE,
  path: '/',
};
