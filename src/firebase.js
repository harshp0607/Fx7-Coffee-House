// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlZ82Ud3DWqPBgyhEr8bLCbSZM2r8GCYk",
  authDomain: "fx7-coffee-house.firebaseapp.com",
  projectId: "fx7-coffee-house",
  storageBucket: "fx7-coffee-house.firebasestorage.app",
  messagingSenderId: "368367390628",
  appId: "1:368367390628:web:510b880a65285cbe87bb31",
  measurementId: "G-ZLP2DGJ24R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { db, messaging, getToken, onMessage };