import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { TeamProfile } from '../types/database';

interface AuthContextState {
  session: Session | null;
  user: User | null;
  profile: TeamProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session: currentSession }
        } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession?.user) {
          await loadProfile(currentSession.user);
        }
      } catch (error) {
        console.error('Failed to load Supabase session', error);
      } finally {
        setLoading(false);
      }
    };

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await loadProfile(newSession.user);
      } else {
        setProfile(null);
      }
    });

    void getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = useCallback(async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('team_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error('Your account is not authorized for the portal.');
        await supabase.auth.signOut();
        return;
      }

      if (!['admin', 'inspector'].includes(data.role)) {
        toast.error('You do not have access to the Horizon admin portal.');
        await supabase.auth.signOut();
        return;
      }

      setProfile(data as TeamProfile);
    } catch (error) {
      console.error('Failed to load team profile', error);
      toast.error('Unable to load your team profile.');
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (!data.session?.user) {
        throw new Error('Invalid login response from Supabase.');
      }

      await loadProfile(data.session.user);
      toast.success('Welcome back to Horizon!');
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error(error.message || 'Unable to sign in.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      login,
      logout
    }),
    [session, profile, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within AuthProvider');
  }
  return context;
};
