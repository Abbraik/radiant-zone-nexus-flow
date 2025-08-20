import { Navigate } from 'react-router-dom';

export default function Auth() {
  // Since authentication is disabled, redirect to registry
  return <Navigate to="/registry" replace />;
}