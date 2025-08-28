import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type UserRole = Tables<'user_roles'>;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, 'User:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user roles when user changes
        if (session?.user) {
          setTimeout(async () => {
            console.log('🔍 Fetching roles for user:', session.user.id);
            const { data: roles, error } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', session.user.id);
            
            console.log('👥 User roles:', roles, 'Error:', error);
            setUserRoles(roles || []);
            setLoading(false);
          }, 0);
        } else {
          console.log('❌ No user session, clearing roles');
          setUserRoles([]);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .then(({ data: roles, error }) => {
            console.log('👥 Initial roles fetch:', roles, 'Error:', error);
            setUserRoles(roles || []);
            setLoading(false);
          });
      } else {
        console.log('❌ No initial session found');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = userRoles.some(role => ['admin', 'owner'].includes(role.role));
  console.log('🛡️ Admin check - Roles:', userRoles, 'IsAdmin:', isAdmin);

  return {
    user,
    session,
    loading,
    userRoles,
    isAdmin,
  };
};