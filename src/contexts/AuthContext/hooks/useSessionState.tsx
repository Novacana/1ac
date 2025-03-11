
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
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Session found:", session.user.id);
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            console.log("Loading user data for:", userData.user.id);
            // Load user data from our database
            const loadedUser = await loadUserData(userData.user.id);
            if (loadedUser) {
              setUser(loadedUser);
              localStorage.setItem('doctor_user', JSON.stringify(loadedUser));
            }
          }
        } else {
          console.log("No session found, checking local storage");
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
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in:", session.user.id);
          const loadedUser = await loadUserData(session.user.id);
          if (loadedUser) {
            setUser(loadedUser);
            localStorage.setItem('doctor_user', JSON.stringify(loadedUser));
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          localStorage.removeItem('doctor_user');
        } else if (event === 'USER_UPDATED' && session) {
          console.log("User updated:", session.user.id);
          const loadedUser = await loadUserData(session.user.id);
          if (loadedUser) {
            setUser(loadedUser);
            localStorage.setItem('doctor_user', JSON.stringify(loadedUser));
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  return { user, setUser, loading };
};
