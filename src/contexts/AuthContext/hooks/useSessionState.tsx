
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { migrateUserData } from '../migration';

export const useSessionState = (loadUserData: (userId: string) => Promise<User | null>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            // Load user data from our database
            await loadUserData(userData.user.id);
          }
        } else {
          const storedUser = localStorage.getItem('doctor_user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(migrateUserData(parsedUser));
            } catch (error) {
              console.error('Error parsing stored user:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('doctor_user');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  return { user, setUser, loading };
};
