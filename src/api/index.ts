import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", 
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
);

export default api;
