import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, createUser, deleteUserById, updateUser } from "../../services/users.service";
import { useAuth } from "../../context/AuthContext";
import type { AppUser, UserRole } from "../../types/User";

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MASTER">("ADMIN");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("USER");

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

  function startEdit(user: AppUser) {
    setEditingId(user.uid);
    setEditName(user.name);
    setEditRole(user.role);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditRole("USER");
  }

  async function handleSaveEdit(uid: string) {
    try {
      await updateUser(uid, { name: editName, role: editRole });
      cancelEdit();
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Erro ao atualizar usuário.");
    }
  }

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
            {editingId === user.uid ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <span> ({user.email}) </span>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as UserRole)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MASTER">MASTER</option>
                </select>
                <button onClick={() => handleSaveEdit(user.uid)}>Salvar</button>
                <button type="button" onClick={cancelEdit}>Cancelar</button>
              </>
            ) : (
              <>
                {user.name} ({user.email}) - {user.role}
                <button type="button" onClick={() => startEdit(user)}>Editar</button>
                {user.uid !== currentUser?.uid && (
                  <button type="button" onClick={() => handleDelete(user.uid)}>Deletar</button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}