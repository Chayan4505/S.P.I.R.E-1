import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  }
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Profile incomplete
  if (!user.isVerified) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default ProtectedRoute;
