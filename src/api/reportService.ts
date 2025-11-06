import api from "./index";

export const reportService = {
  vendorReports: (vendorId: string) => api.get(`/reports/vendor/${vendorId}`),
  customerReports: (customerId: string) => api.get(`/reports/customer/${customerId}`),
};
