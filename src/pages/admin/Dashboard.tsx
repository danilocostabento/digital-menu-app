import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1 className="card__title">Admin Dashboard</h1>
        <p>Bem-vindo, {user.name}</p>
        <p>Role: {user.role}</p>

        <nav>
          <h2 className="card__section-title">Atalhos</h2>
          <ul>
            <li>
              <Link to="/admin/menu">Gerenciar Menu</Link>
            </li>
            {user.role === "MASTER" && (
              <li>
                <Link to="/admin/users">Gerenciar Usuários</Link>
              </li>
            )}
          </ul>
        </nav>

        {user.role === "MASTER" && (
          <div className="form-actions" style={{ marginTop: "1rem" }}>
            <button className="btn-primary" type="button" onClick={handleGoToRegister}>
              Registrar novo usuário
            </button>
          </div>
        )}

        <div className="form-actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
