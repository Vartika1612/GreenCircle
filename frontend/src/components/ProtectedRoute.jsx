import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * Wraps a route requiring authentication (and optionally a specific role).
 * @param {string} [role] - 'CUSTOMER' | 'FARMER' — if omitted, any auth user passes
 * @param {string} [redirectTo] - where to redirect unauthenticated users
 */
export default function ProtectedRoute({ children, role, redirectTo = '/login' }) {
  const { isAuthenticated, user, ready } = useAuth()

  // Wait for localStorage rehydration before deciding
  if (!ready) return <LoadingSpinner />

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />

  if (role && user?.role !== role) return <Navigate to="/" replace />

  return children
}
