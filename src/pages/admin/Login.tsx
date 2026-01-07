import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login useEffect:", { loading, user: user ? { uid: user.uid, role: user.role } : null });
    if (!loading && user) {
      console.log("Navigating to /admin/dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Attempting login with:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        Login
      </button>
    </form>
  );
}
