// src/api/index.ts
import axios from "axios";

const API_BASE = (import.meta.env?.VITE_API_BASE_URL as string) || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/**
 * Set a vault OTP token. token must be a non-empty string.
 * expiresAt, if provided, must be a valid date-string (ISO recommended).
 */
export function setVaultOtpToken(token: string, expiresAt?: string) {
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("setVaultOtpToken: token must be a non-empty string");
  }
  sessionStorage.setItem("vaultOtpToken", token);
  if (expiresAt) {
    const t = Date.parse(expiresAt);
    if (!Number.isFinite(t)) {
      throw new Error("setVaultOtpToken: expiresAt must be a valid date string");
    }
    sessionStorage.setItem("vaultOtpExpiresAt", new Date(t).toISOString());
  } else {
    sessionStorage.removeItem("vaultOtpExpiresAt");
  }
}

/**
 * Clear the stored vault token and expiry.
 * Use this instead of calling setVaultOtpToken(null,...).
 */
export function clearVaultOtpToken() {
  sessionStorage.removeItem("vaultOtpToken");
  sessionStorage.removeItem("vaultOtpExpiresAt");
}

/**
 * Check if a non-expired vault token exists.
 * Returns true/false (no throwing).
 */
export function hasVaultOtpToken(): boolean {
  const token = sessionStorage.getItem("vaultOtpToken");
  if (!token) return false;
  const expiry = sessionStorage.getItem("vaultOtpExpiresAt");
  if (!expiry) return true; // token exists and no expiry set
  const exp = Date.parse(expiry);
  if (!Number.isFinite(exp)) {
    // invalid expiry -> treat as no token (clean up)
    clearVaultOtpToken();
    return false;
  }
  if (Date.now() > exp) {
    clearVaultOtpToken();
    return false;
  }
  return true;
}

/**
 * Get the stored vault token.
 * Throws if token missing or expired. Use hasVaultOtpToken() if you don't want throwing behavior.
 */
export function getVaultOtpToken(): string {
  const token = sessionStorage.getItem("vaultOtpToken");
  if (!token) throw new Error("Vault OTP token not found");
  const expiry = sessionStorage.getItem("vaultOtpExpiresAt");
  if (expiry) {
    const exp = Date.parse(expiry);
    if (!Number.isFinite(exp)) {
      clearVaultOtpToken();
      throw new Error("Vault OTP token expired (invalid expiry)");
    }
    if (Date.now() > exp) {
      clearVaultOtpToken();
      throw new Error("Vault OTP token expired");
    }
  }
  return token;
}

/* Request interceptor uses hasVaultOtpToken so it doesn't call a throwing getter */
api.interceptors.request.use(
  (config) => {
    try {
      // logging is fine for debug; remove if noisy in production
      console.log("🪪 hasVaultOtpToken:", hasVaultOtpToken());
      if (hasVaultOtpToken() && config.headers) {
        // safe to call getVaultOtpToken because hasVaultOtpToken() checked validity
        const vaultOtp = getVaultOtpToken();
        config.headers.Authorization = `Bearer ${vaultOtp}`;
      }
    } catch (err) {
      // if anything goes wrong, ensure we don't attach a bad header
      console.warn("vault token not attached to request:", err);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

/* Response error handler clears the token on 401/403 using clearVaultOtpToken() */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const responseData = err.response?.data ?? { message: err.message };

    if (err.response?.status === 401 || err.response?.status === 403) {
      // clear token explicitly
      clearVaultOtpToken();
    }

    console.error("API error:", responseData);
    throw responseData;
  }
);

export default api;
