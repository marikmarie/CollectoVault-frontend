import axios from "axios";


const API_BASE = (import.meta.env?.VITE_API_BASE_URL as string) || "http://localhost:5000";


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

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
return config;
});


api.interceptors.response.use(
(res) => res,
(err) => {
const responseData = err.response?.data ?? { message: err.message };


if (err.response?.status === 401) {
try { setAuthToken(null); } catch (e) {}
}

console.error("API error:", responseData);
throw responseData;
}
);


export default api;