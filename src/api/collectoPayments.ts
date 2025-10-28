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

