import api from "./index";

export const rewardService = {
  // list rewards for a given customer id
  listForCustomer: (customerId: string) => api.get(`/customers/${customerId}/rewards`),

  // If you add dedicated reward endpoints, implement these
  // get: (id: string) => api.get(`/rewards/${id}`),
  // redeem: (id: string, data: any) => api.post(`/rewards/${id}/redeem`, data),
  
};
