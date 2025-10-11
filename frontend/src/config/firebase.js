// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmzZ28AeSxVHo9NTeANiM-l-DRAQoc45s",
  authDomain: "ereading-e5931.firebaseapp.com",
  projectId: "ereading-e5931",
  storageBucket: "ereading-e5931.firebasestorage.app",
  messagingSenderId: "172534545379",
  appId: "1:172534545379:web:09c3ec246f5d16bb02bed6",
  measurementId: "G-PFLCHB39VG"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
const analytics = getAnalytics(app);