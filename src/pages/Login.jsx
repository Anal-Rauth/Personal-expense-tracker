import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { auth, googleProvider } from "../firebase/firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    fetchSignInMethodsForEmail,
} from "firebase/auth";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(""); // Warning message

    const handleLogin = async (e) => {
        e.preventDefault();
        setWarning(""); // Reset warning
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loginTimestamp", Date.now().toString());
            navigate("/");
        } catch (err) {
            // Check if email exists with Google
            try {
                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.includes("google.com")) {
                    setWarning(
                        "This email is registered with Google sign-in. It is recommended to use Google login."
                    );
                } else {
                    alert(err.message || "Login failed.");
                }
            } catch (error) {
                alert(err.message || "Login failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loginTimestamp", Date.now().toString());
            navigate("/");
        } catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                alert("You closed the login popup before completing sign-in.");
            } else if (error.code === "auth/account-exists-with-different-credential") {
                const email = error.customData.email;
                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.includes("password")) {
                    alert(
                        `An account already exists with this email using password login. 
Please login manually first and then link Google.`
                    );
                } else {
                    alert(error.message);
                }
            } else {
                alert(error.message || "Google sign-in failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin} className="auth-form">
                <h2>Login</h2>

                {/* Warning message */}
                {warning && <p className="login-warning">{warning}</p>}

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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value || "")}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>

                <div className="auth-divider">OR</div>

                <button
                    type="button"
                    className="google-auth-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="google-logo"
                    />
                    Sign in with Google
                </button>

                <p>⬆️Recommended⬆️</p>

                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
}
