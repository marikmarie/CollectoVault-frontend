// src/hooks/useSession.ts
import { useEffect, useState, useCallback } from "react";
import api, { getVaultOtpToken, setVaultOtpToken } from "../api";

/**
 * useSession (router-agnostic)
 * - DOES NOT call useNavigate() so it can be used anywhere (including before Router)
 * - Redirects using window.location when necessary (works without Router)
 */
export default function useSession() {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoaded(false);
    setError(null);

    const vaultToken = getVaultOtpToken();

    // CASE 1 — No token stored
    if (!vaultToken) {
      console.warn("🔒 No vault token found in sessionStorage");
      setError("Token is missing");
      setUser(null);
      setLoaded(true);
      // If you want an immediate redirect to login, use:
       window.location.replace("/login");
      return;
    }

    try {
      // CASE 2 — Fetch current user using vault token sent in Authorization header by api instance
      const resp = await api.get("/api/customer/me");
      setUser(resp.data);
      setError(null);
    } catch (err: any) {
      console.error("❌ Session load failed:", err);
     setVaultOtpToken("empty", "expired");
      setUser(null);
      setError("Session expired or unauthorized");
       window.location.replace("/login");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    setVaultOtpToken("empty", "expired");
    setUser(null);
    window.location.replace("/login");
  }

  return {
    user,
    setUser,
    loaded,
    error,
    logout,
    refresh: load,
    reload: load,
  };
}
