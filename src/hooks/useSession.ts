// src/hooks/useSession.ts
import { useEffect, useState, useCallback } from "react";
import api, { getVaultOtpToken, setVaultOtpToken } from "../api";


export default function useSession() {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoaded(false);
    setError(null);

    const vaultToken = getVaultOtpToken();
if (!vaultToken) {
      console.warn("🔒 No vault token found in sessionStorage");
      setError("Token is missing");
      setUser(null);
      setLoaded(true);
      window.location.replace("/login");
      return;
    }

    try {
      const resp = await api.get("/api/customer/me");
      setUser(resp.data);
      setError(null);
    } catch (err: any) {
      console.error(" Session load failed:", err);
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
