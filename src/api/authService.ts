// import api from "./index";

// export const authService = {
//   register: (data: any) => api.post("/auth/register", data),
//   login: (data: any) => api.post("/auth/login", data),
//   logout: () => api.post("/auth/logout"),
//   me: () => api.get("/auth/me"),
// };


import api, { setAuthToken } from "./index";

export const authService = {
  register: async (data: any) => {
    const resp = await api.post("/auth/register", data);
    // backend should return { token, ...user }
    if (resp?.data?.token) setAuthToken(resp.data.token);
    return resp.data;
  },
  login: async (data: any) => {
    const resp = await api.post("/auth/login", data);
    if (resp?.data?.token) setAuthToken(resp.data.token);
    return resp.data;
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore logout remote failure
    }
    setAuthToken(null);
    return { message: "Logged out" };
  },
  me: async () => {
    const resp = await api.get("/auth/me");
    return resp.data;
  },
};
