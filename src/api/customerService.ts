import api from "./index";

export const customerService = {
  getProfile: (id: string) => api.get(`/customers/${id}`),
  updateProfile: (id: string, data: any) => api.put(`/customers/${id}`, data),
  getRewards: (id: string) => api.get(`/customers/${id}/rewards`),
  getTiers: (id: string) => api.get(`/customers/${id}/tiers`),
};
