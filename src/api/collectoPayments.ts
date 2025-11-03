// src/api/collectoPayments.ts
// Demo payment integration layer that simulates external Collecto payment processing.

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function initiatePayment() {
  await delay();

  const transactionId = `pay_${Math.random().toString(36).slice(2, 12)}`;
  
  return { data: { transactionId, redirectUrl: null, status: "created" } };
}

export async function confirmPayment(transactionId: string) {
  await delay();
  // In demo always succeed
  return { data: { transactionId, status: "completed" } };
}

export default {
  initiatePayment,
  confirmPayment,
};


// src/api/collectoApi.ts
// Mock wrapper for Collecto API vendor lookup (dummy data)
// Replace with a real network call to Collecto in production.

export type CollectoVendor = {
  collectoId: string;
  businessName: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  logoUrl?: string | null;
};

const DUMMY_VENDOR_MAP: Record<string, CollectoVendor> = {
  "C-1001": {
    collectoId: "C-1001",
    businessName: "Forest Park Resort",
    contactEmail: "partners@forestparkresort.com",
    phone: "+256700111222",
    address: "Lakeview Rd, Forest Park",
    logoUrl: "/assets/images/vendor-forestpark.png",
  },
  "C-2001": {
    collectoId: "C-2001",
    businessName: "Forest Mall",
    contactEmail: "hello@forestmall.co",
    phone: "+256700333444",
    address: "Central Ave, Forest Mall",
    logoUrl: "/assets/images/vendor-forestmall.png",
  },
};

/**
 * Simulate an API call to Collecto to fetch vendor details by collectoId.
 * Returns CollectoVendor if found, otherwise null.
 */
export async function fetchCollectoVendor(collectoId: string): Promise<CollectoVendor | null> {
  // normalize
  const id = (collectoId || "").trim().toUpperCase();
  // simulate network latency
  await new Promise((res) => setTimeout(res, 600));
  return DUMMY_VENDOR_MAP[id] ?? null;
}



// // src/api/collectoPayments.ts
// import vaultClient from "./vaultClient";

// const COLLECTO_API_URL = (import.meta.env?.VITE_COLLECTO_API_URL as string) || "";
// const COLLECTO_API_KEY = (import.meta.env?.VITE_COLLECTO_API_KEY as string) || "";

// /**
//  * Create a payment (calls Collecto payment endpoint). If COLLECTO_API_URL not configured or call fails,
//  * return a mocked response to enable demo flows.
//  */
// export async function createPayment(payload: {
//   amount: number; // in minor units or currency as your Collecto API expects
//   currency: string;
//   description?: string;
//   metadata?: Record<string, any>;
// }) {
//   try {
//     if (!COLLECTO_API_URL) throw new Error("NO_COLLECTO_API_URL");

//     const res = await fetch(`${COLLECTO_API_URL.replace(/\/$/, "")}/payments`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: COLLECTO_API_KEY ? `Bearer ${COLLECTO_API_KEY}` : "",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(`Collecto createPayment failed: ${res.status} ${txt}`);
//     }
//     const data = await res.json();
//     return { success: true, data };
//   } catch (err) {
//     // Fallback mock (demo mode)
//     console.warn("collectoPayments.createPayment fallback mock used:", err);
//     const mockId = `mock_pay_${Date.now()}`;
//     return {
//       success: true,
//       data: {
//         id: mockId,
//         status: "pending",
//         amount: payload.amount,
//         currency: payload.currency,
//         description: payload.description,
//         metadata: payload.metadata,
//         checkout_url: `https://collecto.mock/checkout/${mockId}`,
//       },
//     };
//   }
// }

// /**
//  * Verify a payment by ID. If collecto API not configured, simulate success after small delay.
//  */
// export async function verifyPayment(paymentId: string) {
//   try {
//     if (!COLLECTO_API_URL) throw new Error("NO_COLLECTO_API_URL");

//     const res = await fetch(`${COLLECTO_API_URL.replace(/\/$/, "")}/payments/${paymentId}`, {
//       method: "GET",
//       headers: {
//         Authorization: COLLECTO_API_KEY ? `Bearer ${COLLECTO_API_KEY}` : "",
//       },
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(`Collecto verifyPayment failed: ${res.status} ${txt}`);
//     }
//     const data = await res.json();
//     return { success: true, data };
//   } catch (err) {
//     console.warn("collectoPayments.verifyPayment fallback used:", err);
//     // demo: treat mock as completed
//     return {
//       success: true,
//       data: {
//         id: paymentId,
//         status: "completed",
//       },
//     };
//   }
// }

// export default {
//   createPayment,
//   verifyPayment,
// };
