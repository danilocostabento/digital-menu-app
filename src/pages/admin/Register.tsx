import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se já está logado, manda para o dashboard
    if (!loading && user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Preencha nome, email e senha.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      setLoadingLocal(true);
      await createUserWithEmailAndPassword(auth, email, password);

      // Após registrar no Auth, garante que exista um documento em `users`
      // com role padrão USER. Se o admin já tiver criado, não duplica.
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snap = await getDocs(q);

      if (snap.empty) {
        await addDoc(usersRef, {
          name,
          email,
          role: "USER",
          disabled: false,
        });
      }

      // Após registrar, redireciona para login para usar o fluxo normal
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      setError("Erro ao registrar. Verifique o email e tente novamente.");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrar Conta</h2>

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading || loadingLocal}>
        Registrar
      </button>
    </form>
  );
}
