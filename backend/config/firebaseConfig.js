import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // For production, use service account key file
    // For development, you can use environment variables
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Parse service account from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } else {
      // Alternative: Use service account key file
      // Uncomment and modify the path below if using a service account file
      /*
      const serviceAccount = require('./path-to-your-service-account-key.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'your-project-id'
      });
      */
      
      // For development with Firebase CLI (if logged in)
      admin.initializeApp();
    }
    
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
};

// Initialize Firebase
initializeFirebase();

// Export Firebase Auth instance
export const auth = admin.auth();
export const firestore = admin.firestore();

export default admin;