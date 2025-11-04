import api from "./index";

export const vendorService = {
  getDashboard: (vendorId: string) => api.get(`/vendor/${vendorId}/dashboard`),
  getServices: (vendorId: string) => api.get(`/vendor/${vendorId}/services`),
  createService: (data: any) => api.post("/vendor/services", data),
  updateService: (id: string, data: any) => api.put(`/vendor/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/vendor/services/${id}`),

  
  getPointRules: (vendorId: string) => api.get(`/vendor/${vendorId}/point-rules`),
  savePointRule: (vendorId: string, data: any) => api.post(`/vendor/${vendorId}/point-rules`, data),
  getTierRules: (vendorId: string) => api.get(`/vendor/${vendorId}/tier-rules`),
  saveTierRule: (vendorId: string, data: any) => api.post(`/vendor/${vendorId}/tier-rules`, data),
};
