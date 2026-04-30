import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router";

/** Redirige vers /login si l'utilisateur n'est pas connecté. Attend la fin du chargement Auth avant de décider. */
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
