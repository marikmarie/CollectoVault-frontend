// import { useEffect, useState } from "react";
// import { getVaultOtpToken, setVaultOtpToken } from "../api"; 
// import { useNavigate } from "react-router-dom";
// import ROUTES from "../constants/routes";

// export function useVaultSession() {
//   const [token, setToken] = useState<string | null>(getVaultOtpToken());
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) navigate(ROUTES.LOGIN ?? "/login");
//   }, [token]);

//   const logout = () => {
//     setVaultOtpToken("", "null");
//     setToken(null);
//     navigate(ROUTES.LOGIN ?? "/login");
//   };

//   return { token, logout };
// }
