import api from "./index";

export const rewardService = {
  listForCustomer: (customerId: string) => api.get(`/customers/${customerId}/rewards`),
  claimReward: (customerId: string, rewardId: string) => api.post(`/customers/${customerId}/rewards/${rewardId}/claim`),
};
