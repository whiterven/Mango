
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// Consistent mock user for offline mode
const MOCK_USER: User = {
  id: 'offline-user-123',
  email: 'demo@usemango.ai',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: { provider: 'email' },
  user_metadata: { full_name: 'Demo User' },
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
} as User;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const initAuth = async () => {
      if (!supabase) {
        // Offline Mode Logic
        // Check if we were "logged in" previously in offline mode
        const offlineAuth = localStorage.getItem('mango_offline_auth');
        if (offlineAuth === 'true') {
          setUser(MOCK_USER);
        }
        setLoading(false);
        return;
      }

      // Online Mode
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (e) {
        console.error("Auth init error", e);
      } finally {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, [supabase]);

  const signIn = async (email: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } else {
      // Simulate Login
      localStorage.setItem('mango_offline_auth', 'true');
      setUser(MOCK_USER);
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('mango_offline_auth');
      setUser(null);
    }
  };

  return { user, session, loading, signIn, signOut, isOffline: !supabase };
};
