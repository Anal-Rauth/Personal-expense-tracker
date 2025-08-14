import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
            const now = Date.now();

            if (user) {
                const ts = localStorage.getItem("loginTimestamp");

                if (ts && now - Number(ts) > SESSION_DURATION) {
                    // Session expired
                    await signOut(auth);
                    localStorage.removeItem("loginTimestamp");
                    setAuthed(false);
                } else {
                    // Valid session → refresh timestamp on each visit
                    localStorage.setItem("loginTimestamp", now.toString());
                    setAuthed(true);
                }
            } else {
                setAuthed(false);
            }

            setChecking(false);
        });

        return () => unsub();
    }, []);

    if (checking) return null; // or a spinner

    return authed ? children : <Navigate to="/login" replace />;
}
