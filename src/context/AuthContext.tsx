import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getStoredSession, setStoredSession, signOut as authSignOut, signUpWithPhone as authSignUpWithPhone, signInWithPhone as authSignInWithPhone } from '../lib/auth';

interface UserSession {
  id: string;
  phone: string;
  full_name: string;
}

interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  balance: number;
  total_income: number;
  current_level_id: string | null;
  banking_info: any;
  registration_id?: number;
}

interface AuthContextType {
  user: UserSession | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (phone: string, password: string, name: string, referralCode?: string) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
      fetchUserProfile(session.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (phone: string, password: string, name: string, referralCode?: string) => {
    try {
      const session = await authSignUpWithPhone(phone, password, name, referralCode);
      setUser(session);
      await fetchUserProfile(session.id);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      const session = await authSignInWithPhone(phone, password);
      setUser(session);
      await fetchUserProfile(session.id);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      authSignOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
