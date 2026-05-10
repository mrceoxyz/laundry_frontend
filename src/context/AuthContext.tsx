'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, User, initializeAuth } from '@/src/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      setUser(response.user);
      router.push(response.user.role === 'admin' ? '/admin' : '/order');
    } catch (error: any) {
      throw new Error(error.response?.data?.non_field_errors?.[0] || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      setUser(response.user);
      router.push(response.user.role === 'admin' ? '/admin' : '/order');
    } catch (error: any) {
      throw new Error(error.response?.data?.username?.[0] || 'Registration failed');
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    router.push('/login');
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.is_staff || false,
        isCustomer: user?.role === 'customer' || false,
      }}
    >
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
