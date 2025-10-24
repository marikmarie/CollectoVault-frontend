// src/api/vendorsService.ts
// High-level vendor/service/reward APIs for the front-end to call.
// Uses the same mock data in mockDb.

import vault from "./vaultClient";
import { services, vendors, rewards, users, transactions } from "./mockDb";

const adaptResponse = (x: any) => ({ data: x });

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const vendorsService = {
  async getMyServices() {
    // demo: return all services owned by v1 (or vendor-user)
    await delay();
    return adaptResponse(services.filter((s) => s.vendorId === "v1"));
  },

  async getAllServices() {
    await delay();
    return adaptResponse(services);
  },

  async getServicesByVendor(vendorId: string) {
    await delay();
    return adaptResponse(services.filter((s) => s.vendorId === vendorId));
  },

  async createService(payload: any) {
    await delay();
    const id = `s_${Math.random().toString(36).slice(2, 9)}`;
    const s = {
      id,
      vendorId: payload.vendorId ?? "v1",
      title: payload.title,
      description: payload.description || "",
      pricePoints: payload.pricePoints ?? null,
      priceCurrency: payload.priceCurrency ?? null,
      imageUrl: payload.imageUrl ?? null,
      active: payload.active !== undefined ? Boolean(payload.active) : true,
      createdAt: new Date().toISOString(),
    };
    (services as any).push(s);
    // add reward mirror
    (rewards as any).push({
      id: `r-${s.id}`,
      serviceId: s.id,
      title: s.title,
      description: s.description,
      pointsPrice: s.pricePoints ?? null,
      currencyPrice: s.priceCurrency ?? null,
      vendorId: s.vendorId,
      tags: [],
      availability: s.active ? "available" : "coming_soon",
    });
    return adaptResponse(s);
  },

  async updateService(id: string, patch: any) {
    await delay();
    const idx = services.findIndex((s) => s.id === id);
    if (idx >= 0) {
      services[idx] = { ...services[idx], ...patch };
      return adaptResponse(services[idx]);
    }
    throw new Error("Service not found");
  },

  async deleteService(id: string) {
    await delay();
    const idx = services.findIndex((s) => s.id === id);
    if (idx >= 0) {
      services.splice(idx, 1);
      return adaptResponse({ success: true });
    }
    throw new Error("Service not found");
  },

  // Vendor listing / admin
  async getAllVendors() {
    await delay();
    return adaptResponse(vendors);
  },

  async getVendor(id: string) {
    await delay();
    const v = vendors.find((x) => x.id === id);
    return adaptResponse(v || null);
  },

  async createVendor(payload: any) {
    await delay();
    const id = `v_${Math.random().toString(36).slice(2, 9)}`;
    const v = {
      id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      approved: payload.approved ?? false,
      active: payload.active ?? true,
      createdAt: new Date().toISOString(),
    };
    (vendors as any).push(v);
    return adaptResponse(v);
  },

  async updateVendor(id: string, patch: any) {
    await delay();
    const idx = vendors.findIndex((v) => v.id === id);
    if (idx >= 0) {
      vendors[idx] = { ...vendors[idx], ...patch };
      return adaptResponse(vendors[idx]);
    }
    throw new Error("Vendor not found");
  },

  async deleteVendor(id: string) {
    await delay();
    const idx = vendors.findIndex((v) => v.id === id);
    if (idx >= 0) {
      vendors.splice(idx, 1);
      return adaptResponse({ success: true });
    }
    throw new Error("Vendor not found");
  },

  async approveVendor(id: string) {
    await delay();
    const idx = vendors.findIndex((v) => v.id === id);
    if (idx >= 0) {
      vendors[idx].approved = true;
      return adaptResponse(vendors[idx]);
    }
    throw new Error("Vendor not found");
  },

  // Rewards
  async getAllRewards() {
    await delay();
    return adaptResponse(rewards);
  },

  async getTopRewards() {
    await delay();
    // pick rewards with lowest points as "top" or first three
    const top = rewards.slice(0, 3);
    return adaptResponse(top);
  },

  // Reports / admin helpers
  async getVendorTransactions(vendorId: string) {
    await delay();
    const tx = transactions.filter((t) => {
      // naive: match description containing vendorId
      return (t.description || "").includes(vendorId);
    });
    return adaptResponse(tx);
  },
};

export default vendorsService;
