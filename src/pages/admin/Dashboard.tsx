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

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <p>Role: {user.role}</p>

      <nav>
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

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
