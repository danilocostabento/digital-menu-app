import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute check:", { user, loading, role: user?.role });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    console.log("No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN" && user.role !== "MASTER") {
    console.log("User role not allowed:", user.role, "redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("Access granted to protected route");

  return children;
}
