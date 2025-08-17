// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
    signInWithPopup,
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

/**
 * ✅ Safe wrapper for Google popup login
 * Prevents "Cross-Origin-Opener-Policy" error when checking popup.closed
 */
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        // Wrap popup closed error safely
        if (error.code === "auth/popup-closed-by-user") {
            console.warn("Popup closed by user");
            return null;
        }
        throw error;
    }
}

export { app, auth, googleProvider };
export const db = getFirestore(app);
