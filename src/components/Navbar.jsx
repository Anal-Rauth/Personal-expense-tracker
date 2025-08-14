import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Navbar({ onLogout }) {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email) setUsername(user.email);
            else setUsername("");
        });
        return () => unsubscribe();
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1 className="logo">💰 Expense Tracker</h1>
            </div>
            <div className="navbar-center">
                {username && <h2 className="welcome-text">Welcome {username}</h2>}
            </div>
            <div className="navbar-right">
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
}
