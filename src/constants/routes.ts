// src/constants/routes.ts
const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRICING: "/pricing",

  CUSTOMER: {
    DASHBOARD: "/customer/dashboard",
    REWARDS: "/customer/rewards",
    REDEEM: "/customer/redeem",
    TRANSACTIONS: "/customer/transactions",
    CHECKOUT: "/customer/checkout",
    VENDORSTOREFRONT: "/vendor"
  },

  VENDOR: {
    LOGIN: "/vendor/login",
    DASHBOARD: "/vendor/dashboard",
    SERVICES: "/vendor/services",
    UPLOAD_SERVICE: "/vendor/upload-service",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    VENDORS: "/admin/vendors",
    CUSTOMERS: "/admin/customers",
    REPORTS: "/admin/reports",
  },
};

export default ROUTES;
