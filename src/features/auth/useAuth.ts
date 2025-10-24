
/* src/features/auth/useAuth.ts */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import vault from "../../api/vaultClient"; // uses your vaultClient axios instance
import * as authService from "../../api/authService";

export type AuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  role?: "customer" | "vendor" | "admin";
  points?: number;
};

type LoginPayload = { email: string; password: string };
type RegisterPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<AuthUser>) => void;
};

const KEY_TOKEN = "collectovault_token";
const KEY_USER = "collectovault_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider - use at app root to provide auth to the app.
 * It tries to call your api/authService functions; if they fail (missing file or network),
 * it falls back to a demo/mock behaviour so the UI still works during presentations.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(KEY_TOKEN);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(KEY_USER);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // If token present but user missing, optionally fetch profile from vault API
    if (token && !user) {
      (async () => {
        try {
          const resp = await vault.get("/me");
          if (resp?.data) {
            setUser(resp.data);
            localStorage.setItem(KEY_USER, JSON.stringify(resp.data));
          }
        } catch {
          // ignore for demo
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (tkn: string | null, usr: AuthUser | null) => {
    setToken(tkn);
    setUser(usr);
    try {
      if (tkn) localStorage.setItem(KEY_TOKEN, tkn); else localStorage.removeItem(KEY_TOKEN);
      if (usr) localStorage.setItem(KEY_USER, JSON.stringify(usr)); else localStorage.removeItem(KEY_USER);
    } catch {
      // ignore storage errors
    }
  };

  const login = async (payload: LoginPayload) => {
    // prefer to use your authService if available
    try {
      if ((authService as any)?.login) {
        const res = await (authService as any).login(payload.email, payload.password);
        // adapt to expected response shapes
        const data = res?.data ?? res;
        const tkn = data.token ?? data.accessToken ?? null;
        const usr = data.user ?? data;
        persist(tkn, usr);
        return usr as AuthUser;
      }
    } catch (err) {
      // fallthrough to fallback below
      console.warn("authService.login failed:", err);
    }

    // fallback: mock login for demos
    const demoUser: AuthUser = {
      id: "demo-user",
      firstName: "Demo",
      lastName: "User",
      email: payload.email,
      role: "customer",
      points: 1240,
    };
    persist("demo-token", demoUser);
    return demoUser;
  };

  const register = async (payload: RegisterPayload) => {
    try {
      if ((authService as any)?.register) {
        const res = await (authService as any).register(payload);
        const data = res?.data ?? res;
        const tkn = data.token ?? data.accessToken ?? null;
        const usr = data.user ?? data;
        persist(tkn, usr);
        return usr as AuthUser;
      }
    } catch (err) {
      console.warn("authService.register failed:", err);
    }

    // fallback demo registration
    const demoUser: AuthUser = {
      id: "demo-user-" + Date.now(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: "customer",
      points: 0,
    };
    persist("demo-token", demoUser);
    return demoUser;
  };

  const logout = async () => {
    // optionally call vault API to revoke token
    try {
      if (token && (authService as any)?.logout) {
        await (authService as any).logout();
      }
    } catch {
      // ignore
    } finally {
      persist(null, null);
      // redirect to landing for presentations
      try {
        navigate("/");
      } catch {
        // nothing
      }
    }
  };

  const updateProfile = (patch: Partial<AuthUser>) => {
    const next = { ...(user ?? {}), ...patch };
    setUser(next);
    try {
      localStorage.setItem(KEY_USER, JSON.stringify(next));
    } catch {}
  };

  const ctx: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider. Wrap your app with <AuthProvider />");
  }
  return ctx;
};
