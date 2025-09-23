import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Minimal auth gate. Use requireType to restrict to 'user', 'doctor', or 'any'.
// fallback controls redirect path when not authenticated.
export default function RequireAuth({ children, requireType = 'any', fallback }) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const hasUser = !!user || !!localStorage.getItem('user');
  const hasDoctor = !!localStorage.getItem('DoctorID');

  const isAuthed =
    requireType === 'user' ? hasUser :
    requireType === 'doctor' ? hasDoctor :
    hasUser || hasDoctor;

  if (isAuthed) return children;

  const redirectTo = fallback || (requireType === 'doctor' ? '/doctorlogin' : '/login');
  return <Navigate to={redirectTo} replace state={{ from: location }} />;
}
 
RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  requireType: PropTypes.oneOf(['any', 'user', 'doctor']),
  fallback: PropTypes.string,
};
 
