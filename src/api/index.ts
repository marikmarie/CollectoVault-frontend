// src/api/index.ts
import axios from "axios";

const API_BASE = (import.meta.env?.VITE_API_BASE_URL as string) || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// --- Auth helpers (fixed keys + expiry handling) ---
export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("collecto_token", token);
  else localStorage.removeItem("collecto_token");
}
export function getAuthToken(): string | null {
  return localStorage.getItem("collecto_token");
}

export function setVaultOtpToken(token: string | null, expiresAt?: string | null) {
  if (token) {
    sessionStorage.setItem("vaultOtpToken", token);
    if (expiresAt) sessionStorage.setItem("vaultOtpExpiresAt", expiresAt);
    else sessionStorage.removeItem("vaultOtpExpiresAt");
  } else {
    sessionStorage.removeItem("vaultOtpToken");
    sessionStorage.removeItem("vaultOtpExpiresAt");
  }
}

export function getVaultOtpToken(): string | null {
  const token = sessionStorage.getItem("vaultOtpToken");
  const expiry = sessionStorage.getItem("vaultOtpExpiresAt");
  if (!token) return null;
  if (expiry) {
    const now = Date.now();
    const exp = new Date(expiry).getTime();
    if (Number.isFinite(exp) && now > exp) {
      // expired
      setVaultOtpToken(null, null);
      return null;
    }
  }
  return token;
}

// --- Axios interceptors: prefer vault token as Authorization bearer ---
api.interceptors.request.use((config) => {
  const vaultOtp = getVaultOtpToken();
  //const jwt = getAuthToken();

  // prefer vault OTP token for identifying customers (as requested)
  if (vaultOtp && config.headers) {
    config.headers.Authorization = `Bearer ${vaultOtp}`;
   } 
  //  else if (jwt && config.headers) {
  //   config.headers.Authorization = `Bearer ${jwt}`;
  // }

  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const responseData = err.response?.data ?? { message: err.message };
    // If unauthorized, clear tokens
    if (err.response?.status === 401 || err.response?.status === 403) {
      setVaultOtpToken(null, null);
    //  setAuthToken(null);
    }
    console.error("API error:", responseData);
    throw responseData;
  }
);

export default api;
