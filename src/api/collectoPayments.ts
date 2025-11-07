// src/api/collectoPayments.ts
const COLLECTO_API_URL = (import.meta.env?.VITE_COLLECTO_API_URL as string) || "";
const COLLECTO_API_KEY = (import.meta.env?.VITE_COLLECTO_API_KEY as string) || "";

export type CollectoVendor = {
  collectoId: string;
  businessName: string;
  contactEmail: string;
  phone?: string | null;
  // add any other fields Collecto returns that you need
  metadata?: Record<string, any>;
};

/**
 * Create a payment (calls Collecto payment endpoint). If COLLECTO_API_URL not configured or call fails,
 * return a mocked response to enable demo flows.
 */
export async function createPayment(payload: {
  amount: number; // in minor units or currency as your Collecto API expects
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
}) {
  try {
    if (!COLLECTO_API_URL) throw new Error("NO_COLLECTO_API_URL");

    const res = await fetch(`${COLLECTO_API_URL.replace(/\/$/, "")}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: COLLECTO_API_KEY ? `Bearer ${COLLECTO_API_KEY}` : "",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Collecto createPayment failed: ${res.status} ${txt}`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    // Fallback mock (demo mode)
    console.warn("collectoPayments.createPayment fallback mock used:", err);
    const mockId = `mock_pay_${Date.now()}`;
    return {
      success: true,
      data: {
        id: mockId,
        status: "pending",
        amount: payload.amount,
        currency: payload.currency,
        description: payload.description,
        metadata: payload.metadata,
        checkout_url: `https://collecto.mock/checkout/${mockId}`,
      },
    };
  }
}

/**
 * Verify a payment by ID. If collecto API not configured, simulate success after small delay.
 */
export async function verifyPayment(paymentId: string) {
  try {
    if (!COLLECTO_API_URL) throw new Error("NO_COLLECTO_API_URL");

    const res = await fetch(`${COLLECTO_API_URL.replace(/\/$/, "")}/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: COLLECTO_API_KEY ? `Bearer ${COLLECTO_API_KEY}` : "",
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Collecto verifyPayment failed: ${res.status} ${txt}`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.warn("collectoPayments.verifyPayment fallback used:", err);
    // demo: treat mock as completed
    return {
      success: true,
      data: {
        id: paymentId,
        status: "completed",
      },
    };
  }
}

/**
 * Fetch vendor/business details from Collecto by Collecto ID.
 * If the API isn't configured or call fails, returns null (so caller can show "not found")
 * or a mocked vendor in demo mode (you can change to null to force manual flow).
 */
export async function fetchCollectoVendor(collectoId: string): Promise<CollectoVendor | null> {
  try {
    if (!COLLECTO_API_URL) throw new Error("NO_COLLECTO_API_URL");

    const res = await fetch(`${COLLECTO_API_URL.replace(/\/$/, "")}/vendors/${encodeURIComponent(collectoId)}`, {
      method: "GET",
      headers: {
        Authorization: COLLECTO_API_KEY ? `Bearer ${COLLECTO_API_KEY}` : "",
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Collecto fetchCollectoVendor failed: ${res.status} ${txt}`);
    }

    const json = await res.json();
    const payload = json;

    const vendor: CollectoVendor = {
      collectoId: payload.collectoId ?? payload.id ?? collectoId,
      businessName: payload.businessName ?? payload.name ?? "",
      contactEmail: payload.contactEmail ?? payload.email ?? "",
      phone: payload.phone ?? null,
      metadata: payload.metadata ?? {},
    };

    return vendor;
  } catch (err) {
    console.warn("collectoPayments.fetchCollectoVendor fallback used:", err);
    return {
      collectoId,
      businessName: ` Business ${collectoId}`,
      contactEmail: `contact+${collectoId}@tm.collecto`,
      phone: `256789006785`,
      metadata: {},
    };
  }
}

export default {
  createPayment,
  verifyPayment,
  fetchCollectoVendor,
};
