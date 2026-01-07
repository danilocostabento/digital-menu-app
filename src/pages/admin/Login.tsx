import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="app-shell">
      <form className="card" onSubmit={handleLogin}>
        <h2 className="card__title">Admin Login</h2>

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            Login
          </button>
        </div>

        <p>
          Não tem conta? <Link to="/register">Registrar</Link>
        </p>
      </form>
    </div>
  );
}
