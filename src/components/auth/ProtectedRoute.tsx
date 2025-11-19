/**
 * Protected Route Component
 * Restricts access based on authentication and role
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, requirePasswordReset } = useAuthStore();
  const location = useLocation();

  // Check if authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if password reset is required
  if (requirePasswordReset && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />;
  }

  // Check admin access
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/staff" replace />;
  }

  // Check staff trying to access admin routes
  if (!requireAdmin && location.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    return <Navigate to="/staff" replace />;
  }

  return <>{children}</>;
}
