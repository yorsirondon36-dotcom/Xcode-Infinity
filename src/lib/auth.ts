import bcryptjs from 'bcryptjs';
import { supabase } from './supabase';

const SESSION_KEY = 'user_session';

interface UserSession {
  id: string;
  phone: string;
  full_name: string;
}

export const generateReferralCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcryptjs.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
};

export const getStoredSession = (): UserSession | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setStoredSession = (session: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearStoredSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const signUpWithPhone = async (
  phone: string,
  password: string,
  fullName: string,
  referralCode?: string
): Promise<UserSession> => {
  const passwordHash = await hashPassword(password);
  const newReferralCode = generateReferralCode();

  const { data, error } = await supabase
    .from('users')
    .insert([{
      phone,
      password_hash: passwordHash,
      full_name: fullName,
      referral_code: newReferralCode,
      referred_by_code: referralCode || null,
    }])
    .select('id, phone, full_name')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create user');

  const session: UserSession = {
    id: data.id,
    phone: data.phone,
    full_name: data.full_name,
  };

  setStoredSession(session);
  return session;
};

export const signInWithPhone = async (
  phone: string,
  password: string
): Promise<UserSession> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, phone, full_name, password_hash')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Invalid phone or password');

  const isPasswordValid = await verifyPassword(password, data.password_hash);
  if (!isPasswordValid) throw new Error('Invalid phone or password');

  const session: UserSession = {
    id: data.id,
    phone: data.phone,
    full_name: data.full_name,
  };

  setStoredSession(session);
  return session;
};

export const signOut = (): void => {
  clearStoredSession();
};
