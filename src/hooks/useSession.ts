// src/hooks/useSession.ts
import { useEffect, useState, useCallback } from "react";
import api, { getVaultOtpToken, setAuthToken, setVaultOtpToken } from "../api";

export default function useSession() {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setLoaded(false);
    const vaultToken = getVaultOtpToken();
    if (!vaultToken) {
      // no vault token — not logged in
      setUser(null);
      setLoaded(true);
      return;
    }

    try {
      // api interceptor will attach Authorization: Bearer <vaultToken>
      const resp = await api.get("/api/customer/me");
      setUser(resp.data);
    } catch (err) {
      // failed to fetch profile => clear tokens
      setAuthToken(null);
      setVaultOtpToken(null, null);
      setUser(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function logout() {
    setAuthToken(null);
    setVaultOtpToken(null, null);
    setUser(null);
  }

  return { user, setUser, loaded, logout, refresh: load, reload: load };
}
