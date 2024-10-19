// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2KTunPU6Bfgjw7ayPdwbaK6_JW2g4cF8",
  authDomain: "hospitalmanagment-83108.firebaseapp.com",
  projectId: "hospitalmanagment-83108",
  storageBucket: "hospitalmanagment-83108.appspot.com",
  messagingSenderId: "205079003299",
  appId: "1:205079003299:web:0d88065cfc9192f0bb7f16"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);