// src/api/collectoPayments.ts
// Demo payment integration layer that simulates external Collecto payment processing.

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function initiatePayment(opts: { amount: number; currency?: string; description?: string; returnUrl?: string }) {
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
