'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  email: string;
  telephone: string;
  nomComplet: string;
  role: string;
  centreRegional?: string;
  actif: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  telephone: string;
  nomComplet: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Réponse invalide du serveur');
      }
      
      const { token: newToken, user: userData } = response;
      
      Cookies.set('token', newToken, { expires: 7 });
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
      
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      console.error('AuthContext login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    const userData = await authAPI.register(data);
    // After registration, automatically log in
    // Note: You might need to adjust this based on your API response
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
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

