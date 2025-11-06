// src/api/vendorService.ts
import api from "./index";

export const vendorService = {
  getMyServices: () => api.get(`/api/vendor/services`),

  getMetrics: (vendorId: string) => api.get(`/api/vendor/${vendorId}/metrics`),

  createService: (data: any) => api.post("/api/vendor/services", data),

  updateService: (id: string | number, data: any) =>
    api.put(`/api/vendor/services/${id}`, data),

  deleteService: (id: string | number) =>
    api.delete(`/api/vendor/services/${id}`),

  getPointRules: (vendorId: string) => api.get(`/api/vendor/${vendorId}/point-rules`),
  savePointRule: (vendorId: string, data: any) => api.post(`/api/vendor/${vendorId}/point-rules`, data),

  getTierRules: (vendorId: string) => api.get(`/api/vendor/${vendorId}/tier-rules`),
  saveTierRule: (vendorId: string, data: any) => api.post(`/api/vendor/${vendorId}/tier-rules`, data),
};
