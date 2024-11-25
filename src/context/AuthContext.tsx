import React, { createContext, useContext, useState, useCallback } from 'react';
import * as auth from '../lib/auth';
import { supabase } from '../lib/supabase'; // Assuming supabase is imported from another file

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  is_approved: boolean;
  onboarding_complete: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ user: User; isAdmin: boolean }>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: refreshedUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    try {
      const result = await auth.signIn(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      await auth.signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the local user state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}