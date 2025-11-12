// src/context/AuthContext.tsx
import React, { createContext, useContext, type ReactNode } from "react";
import useSession from "../hooks/useSession";

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  loaded: boolean;
  logout: () => Promise<void> | void;
  refresh: () => Promise<void> | void;
  reload: () => Promise<void> | void;
  setUser: (u: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loaded, logout, refresh, reload, setUser } = useSession();

  const value: AuthContextType = {
    user,
    loaded,
    isAuthenticated: !!user,
    logout,
    refresh,
    reload,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
