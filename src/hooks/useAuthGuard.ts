import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthGuard = (requireAdmin: boolean = false) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to auth page
        navigate('/auth', { 
          state: { from: location },
          replace: true 
        });
      } else if (requireAdmin && !isAdmin) {
        // User is authenticated but not admin, redirect to home
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, isAdmin, requireAdmin, navigate, location]);

  return { user, loading, isAdmin };
};