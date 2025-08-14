import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            await signOut(auth); // Force manual login
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("loginTimestamp");
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert(err.message || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSignup} className="auth-form">
                <h2>Create Account</h2>
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value || "")}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value || "")}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                <div className="auth-divider">OR</div>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}
