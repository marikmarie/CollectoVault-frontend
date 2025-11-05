


// // src/api/vaultClient.ts
// export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// const VAULT_API_URL = (import.meta.env?.VITE_VAULT_API_URL as string) || "";

// async function request<T = any>(path: string, method: HttpMethod = "GET", body?: any, headers: Record<string, string> = {}) {
//   if (!VAULT_API_URL) {
//     // No remote Vault API configured — let callers handle mock fallback.
//     throw new Error("NO_VAULT_API_URL");
//   }

//   const url = `${VAULT_API_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
//   const opts: RequestInit = {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...headers,
//     },
//   };
//   if (body !== undefined) opts.body = JSON.stringify(body);

//   const res = await fetch(url, opts);
//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`Request failed ${res.status} ${res.statusText} ${text}`);
//   }
//   const data = await res.json().catch(() => null);
//   return data as T;
// }

// export default {
//   request,
//   get: <T = any>(path: string, headers?: Record<string, string>) => request<T>(path, "GET", undefined, headers),
//   post: <T = any>(path: string, body?: any, headers?: Record<string, string>) => request<T>(path, "POST", body, headers),
//   put: <T = any>(path: string, body?: any, headers?: Record<string, string>) => request<T>(path, "PUT", body, headers),
//   patch: <T = any>(path: string, body?: any, headers?: Record<string, string>) => request<T>(path, "PATCH", body, headers),
//   del: <T = any>(path: string, body?: any, headers?: Record<string, string>) => request<T>(path, "DELETE", body, headers),
// };
