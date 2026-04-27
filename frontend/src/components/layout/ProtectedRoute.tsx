import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
