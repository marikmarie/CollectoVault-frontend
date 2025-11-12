// src/hooks/useSession.ts
import { useEffect, useState } from "react";
import api, { getAuthToken, setAuthToken, setVaultOtpToken } from "../api";

export default function useSession() {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const token = getAuthToken();
    if (!token) {
      setLoaded(true);
      return;
    }

    try {
      const resp = await api.get("/api/customer/me");
      setUser(resp.data);
    } catch {
      setAuthToken(null);
      setVaultOtpToken(null);
      setUser(null);
    } finally {
      setLoaded(true);
    }
  }

  async function logout() {
    setAuthToken(null);
    setVaultOtpToken(null);
    setUser(null);
  }

  useEffect(() => { load(); }, []);

  return { user, setUser, loaded, logout, refresh: load, reload: load };
}
