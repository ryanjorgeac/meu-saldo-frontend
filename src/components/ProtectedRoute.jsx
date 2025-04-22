import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!loading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (loading) {
    return null;
  }
  return children;
}