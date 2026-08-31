'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type UserRole = 'admin' | 'user';

interface AuthContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isUser: boolean;
  userName: string;
  userWallet: string;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ROLE_STORAGE_KEY = 'blockchain_app_role';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved === 'user' || saved === 'admin') {
        return saved;
      }
    }
    return 'admin';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    }
  };

  const toggleRole = () => {
    setRole(role === 'admin' ? 'user' : 'admin');
  };

  const userName = role === 'admin' ? 'Admin Operator' : 'Alice Vance';
  const userWallet = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

  const value = useMemo(
    () => ({
      role,
      setRole,
      isAdmin: role === 'admin',
      isUser: role === 'user',
      userName,
      userWallet,
      toggleRole,
    }),
    [role, userName, userWallet]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
