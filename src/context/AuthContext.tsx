/* src/context/AuthContext.tsx
   New AuthContext backed by the session hook + authService.
   This keeps the same API shape as your old AuthContext so other components
   can keep importing `useAuth()` and the same <AuthProvider> wrapper.
*/

import React, { createContext, useContext, type ReactNode } from "react";
import useSession from "../hooks/useSession";
import { authService } from "../api/authService";
import api from "../api";

type User = any;

type RegisterPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loginCustomer: (payload: { email: string; password: string }) => Promise<any>;
  loginStaff: (payload: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload, role?: string) => Promise<any>;
  updateProfile: (patch: Partial<User>) => Promise<User | null>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // useSession gives us loading, user, refresh, logout, setUser etc.
  const session = useSession() as any;
  const { user, loading, refresh, logout: sessionLogout, setUser } = session;

  // Wrapper: login for customers (delegates to authService)
  const loginCustomer = async (payload: { email: string; password: string }) => {
    const resp = await authService.login(payload);
    // authService should persist token; refresh session
    if (refresh) await refresh();
    return resp;
  };

  // Wrapper for staff login (you can refine if you have separate staff endpoints)
  const loginStaff = async (payload: { email: string; password: string }) => {
    const resp = await authService.login(payload);
    if (refresh) await refresh();
    return resp;
  };

  const logout = async () => {
    try {
      await sessionLogout();
    } finally {
      // ensure local user cleared
      setUser(null);
    }
  };

  // register: calls backend and then refreshes session so the user is logged in
  const register = async (payload: RegisterPayload & { role?: string }, role?: string) => {
    const body = { ...payload, role };
    const resp = await authService.register(body as any);
    if (refresh) await refresh();
    return resp;
  };

  // updateProfile: patch the customer record and refresh
  const updateProfile = async (patch: Partial<User>) => {
    if (!user?.id) return null;
    // backend endpoint expected: PUT /api/customers/:id
    await api.put(`/customers/${user.id}`, patch);
    if (refresh) {
      const updated = await refresh();
      return updated;
    }
    return null;
  };

  const value: AuthContextType = {
    user: user ?? null,
    isAuthenticated: !!user && !loading,
    loginCustomer,
    loginStaff,
    logout,
    register,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
