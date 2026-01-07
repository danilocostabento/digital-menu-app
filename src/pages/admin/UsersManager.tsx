import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUserById, updateUser } from "../../services/users.service";
import { useAuth } from "../../context/AuthContext";
import type { AppUser, UserRole } from "../../types/User";

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="app-shell">
      <div className="card">
        <h1 className="card__title">Gerenciar Usuários</h1>
        <p className="card__section-title">
          <Link to="/admin/dashboard">Voltar ao Dashboard</Link>
        </p>
        <h2 className="card__section-title">Usuários Ativos</h2>
        <ul>
        {users.map(user => (
          <li key={user.uid}>
            {editingId === user.uid ? (
              <>
                  <div className="form-field">
                    <label>Nome</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </div>
                  <span> ({user.email}) </span>
                  <div className="form-field">
                    <label>Role</label>
                    <select
                      value={editRole}
                      onChange={e => setEditRole(e.target.value as UserRole)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MASTER">MASTER</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit(user.uid)}>Salvar</button>
                    <button className="btn-ghost" type="button" onClick={cancelEdit}>Cancelar</button>
                  </div>
              </>
            ) : (
              <>
                  {user.name} ({user.email}) - {user.role}
                  <div className="form-actions">
                    <button className="btn-ghost" type="button" onClick={() => startEdit(user)}>Editar</button>
                    {user.uid !== currentUser?.uid && (
                      <button className="btn-ghost" type="button" onClick={() => handleDelete(user.uid)}>Deletar</button>
                    )}
                  </div>
              </>
            )}
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}