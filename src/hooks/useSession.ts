/* src/hooks/useSession.ts */
import { useEffect, useCallback, useState } from "react";
import { authService } from "../api/authService";

export type SessionUser = any;

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // authService.me() should return user object (or throw 401)
      const data = await authService.me();
      // support API that returns { user } or user directly
      const resolved = (data && (data.user ?? data)) as SessionUser;
      setUser(resolved ?? null);
      return resolved ?? null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // logout helper that clears token via authService and resets user
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refresh();
    })();
    return () => { mounted = false; };
  }, [refresh]);

  const isAuthenticated = !!user;

  return { user, setUser, loading, refresh, logout, isAuthenticated };
}

// make the hook available as default export too, prevents import errors
export default useSession;
