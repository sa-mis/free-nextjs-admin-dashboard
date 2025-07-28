"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  permissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          const profile = await authService.getProfile();
          setUser(profile.data.user);
          setIsAuthenticated(true);
          setPermissions(profile.data.user?.permissions || []);
        } else {
          setIsAuthenticated(false);
          setPermissions([]);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setPermissions([]);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      if (credentials.remember) {
        localStorage.setItem('token', data.token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', data.token);
        localStorage.removeItem('token');
      }
      setUser(data.data.user);
      setIsAuthenticated(true);
      setPermissions(data.data.user?.permissions || []);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
      setIsAuthenticated(false);
      setPermissions([]);
      throw error; // Re-throw to allow component to handle
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setPermissions([]);
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
