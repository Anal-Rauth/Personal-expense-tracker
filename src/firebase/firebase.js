// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Setup Auth
const auth = getAuth(app);

// Make login persist across page refreshes
setPersistence(auth, browserLocalPersistence);

const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

export const db = getFirestore(app); 