// src/api/authService.ts  (append / update)
import api, { setVaultOtpToken } from "./index";

export const authService = {

  startCollectoAuth: async (payload: {
    type: "business" | "client" | "staff";
    collectoId?: string;
    cid?: string;
    uid?: string;
   }) => {
    const resp = await api.post("/api/collecto/auth", payload);
    return resp.data;
  },

 
 verifyCollectoOtp: async (payload: {
    id: string;
    vaultOTP: string;
    vaultOTPToken?: string;

  }) => {
    const resp = await api.post("/api/collecto/authVerify", payload);
    const data = resp.data;
    if (data?.token) {
      const expiresAt = new Date(Date.now() + 5 *60*1000).toISOString();

      setVaultOtpToken(data.data.vaultOTPToken, expiresAt); 
    }
   
    return data;
  },
};

export default authService;



// // src/api/authService.ts
// import api, { setAuthToken } from "./index";

// export const authService = {
//   // existing functions (register/login/logout/me) remain...
//   // ---- START Collecto OTP flow ----
//   startCollectoAuth: async (payload: {
//     type: "business" | "client" | "staff";
//     uid?: string;
//     cid?: string;
//     ccode?: string;
//   }) => {
//     const resp = await api.post("/collecto/auth", payload);
//     return resp.data;
//   },

//   verifyCollectoOtp: async (payload: {
//     type: "business" | "client" | "staff";
//     uid?: string;
//     cid?: string;
//     ccode?: string;
//     otpCode: string;
//   }) => {
//     const resp = await api.post("/collecto/authVerify", payload);
//     const data = resp.data;
//     // If Collecto returns a token, store it so vault APIs that require auth can use it
//     if (data?.token) {
//       setAuthToken(data.token);
//     }
//     return data;
//   },

//   /**
//    * Ensure business exists in Vault DB.
//    * Called after a successful business login for the first-time business flow.
//    * Backend path: POST /api/business/ensure
//    * Body: { collecto_id, name?, otherIdentifiers? }
//    */
//   ensureBusiness: async (payload: { collecto_id: string; name?: string; ccode?: string; cid?: string }) => {
//     const resp = await api.post("/api/business/ensure", payload);
//     return resp.data;
//   },

//   // keep older functions (login/logout/me) as you had them...
//   login: async (data: any) => {
//     const resp = await api.post("/api/auth/login", data);
//     if (resp?.data?.token) setAuthToken(resp.data.token);
//     return resp.data;
//   },

//   logout: async () => {
//     try {
//       await api.post("/api/auth/logout");
//     } catch (err) {}
//     setAuthToken(null);
//     return { message: "Logged out" };
//   },

//   me: async () => {
//     const resp = await api.get("/api/auth/me");
//     return resp.data;
//   },
// };
