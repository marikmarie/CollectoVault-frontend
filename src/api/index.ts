import axios from "axios";


const API_BASE = (import.meta.env?.VITE_API_BASE_URL as string);


const api = axios.create({
baseURL: API_BASE,
timeout: 15000,
});

// Token helpers
export function setAuthToken(token: string | null) {
if (token) {
localStorage.setItem("collecto_token", token);

} else {
localStorage.removeItem("collecto_token");
}
}

export function getAuthToken(): string | null {
return localStorage.getItem("collecto_token");
}

// setting otp session
export function setVaultOtpToken(token: string | null, expiresAt?:string | null){
  if(token){
    sessionStorage.setItem("vaultOtpToken", token);
    if(expiresAt) 
      sessionStorage.setItem("expiresAt", expiresAt);
  }else{
    sessionStorage.removeItem("vaultOptToken");
    sessionStorage.removeItem("expiresAt");
  }
}

export function getVaultOtpToken(): string | null{
  const otp = sessionStorage.getItem("vaultOtpRoken");
  const expiry = sessionStorage.getItem("expiresAt");
  if(expiry){
    const now = Date.now();
    if(now > new Date (expiry).getTime()){
      setVaultOtpToken(null, null);
      return null;
    }
  }
  return otp;
}

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

 // vault otp
 const vaultOtp = getVaultOtpToken();
 if(vaultOtp && config.headers) config.headers["vaultOtpToken"]= vaultOtp;

return config;
});




api.interceptors.response.use(
(res) => res,
(err) => {
const responseData = err.response?.data ?? { message: err.message };
if (err.response?.status == 401 || err.response?.status ==403){
  setVaultOtpToken(null, null);
  setAuthToken(null);
}

console.error("API error:", responseData);
throw responseData;
}
);


export default api;