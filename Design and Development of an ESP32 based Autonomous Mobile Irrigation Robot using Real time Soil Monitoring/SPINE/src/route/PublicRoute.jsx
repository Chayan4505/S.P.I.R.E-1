import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user && !user.isVerified) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default PublicRoute;