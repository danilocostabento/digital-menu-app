import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, createUser, deleteUserById } from "../../services/users.service";
import { useAuth } from "../../context/AuthContext";
import type { AppUser } from "../../types/User";

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MASTER">("ADMIN");

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createUser(email, password, name, role);
      setEmail("");
      setPassword("");
      setName("");
      setRole("ADMIN");
      loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Erro ao criar usuário (somente documento Firestore). Verifique regras do Firestore.");
    }
  }

  async function handleDelete(uid: string) {
    if (uid === currentUser?.uid) {
      alert("Você não pode deletar seu próprio usuário.");
      return;
    }
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await deleteUserById(uid);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Erro ao deletar usuário.");
      }
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Gerenciar Usuários</h1>
      <Link to="/admin/dashboard">Voltar ao Dashboard</Link>

      <h2>Criar Novo Usuário (registro lógico)</h2>
      <form onSubmit={handleCreate}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select value={role} onChange={e => setRole(e.target.value as "ADMIN" | "MASTER")}>
          <option value="ADMIN">ADMIN</option>
          <option value="MASTER">MASTER</option>
        </select>
        <button type="submit">Criar</button>
      </form>

      <h2>Usuários Ativos</h2>
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            {user.name} ({user.email}) - {user.role}
            {user.uid !== currentUser?.uid && (
              <button onClick={() => handleDelete(user.uid)}>Deletar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}