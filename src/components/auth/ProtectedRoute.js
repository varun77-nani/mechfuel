// src/components/auth/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or a loader component

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Works with both <ProtectedRoute><Component/></ProtectedRoute>
  // and <Route element={<ProtectedRoute />} />
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
