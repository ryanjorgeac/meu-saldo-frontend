import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!loading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (loading) {
    return <LoadingSpinner overlay={true} />;
  }
  return children;
};