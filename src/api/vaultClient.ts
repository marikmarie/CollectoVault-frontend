

import { users, getUserById, services, vendors, rewards, transactions, orders } from "./mockDb";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

function wrap(data: any) {
  return { data };
}

async function get(path: string) {
  await delay(250);
  // simple routing
  // /me - return demo user if token present (we don't implement tokens here)
  if (path === "/me") {
    return wrap(getUserById("demo-user"));
  }

  // /customers/:id/points
  const mCustPoints = path.match(/^\/customers\/([^/]+)\/points$/);
  if (mCustPoints) {
    const id = mCustPoints[1];
    const u = getUserById(id);
    return wrap({ balance: u ? u.points : 0 });
  }

  // /customers/:id/transactions
  const mCustTx = path.match(/^\/customers\/([^/]+)\/transactions$/);
  if (mCustTx) {
    const id = mCustTx[1];
    const userTx = transactions.filter((t) => t.userId === id);
    return wrap(userTx);
  }

  // /vendors
  if (path === "/vendors") {
    return wrap(vendors);
  }

  // /services or /services/:id
  if (path === "/services" || path === "/all-services") {
    return wrap(services);
  }
  const mService = path.match(/^\/services\/([^/]+)$/);
  if (mService) {
    const id = mService[1];
    const s = services.find((x) => x.id === id);
    return wrap(s || null);
  }

  // /vendors/:id/services
  const mVendorServices = path.match(/^\/vendors\/([^/]+)\/services$/);
  if (mVendorServices) {
    const vid = mVendorServices[1];
    const svc = services.filter((s) => s.vendorId === vid);
    return wrap(svc);
  }

  // /rewards
  if (path === "/rewards") return wrap(rewards);
  const mReward = path.match(/^\/rewards\/([^/]+)$/);
  if (mReward) {
    const id = mReward[1];
    const r = rewards.find((x) => x.id === id);
    return wrap(r || null);
  }

  // /orders/:id
  const mOrder = path.match(/^\/orders\/([^/]+)$/);
  if (mOrder) {
    const id = mOrder[1];
    const ord = orders.find((o) => o.id === id);
    return wrap(ord || null);
  }

  // fallback - return null
  return wrap(null);
}

async function post(path: string, payload?: any) {
  await delay(300);
  // /auth/login not handled here (authService uses separate file), but we can handle other posts:
  // /orders -> create order
  if (path === "/orders") {
    const id = `ord-${Math.random().toString(36).slice(2, 9)}`;
    const items = payload.items || [];
    const totalPoints = items.reduce((s: number, it: any) => s + (it.pricePoints ?? 0) * (it.qty ?? 1), 0);
    const totalCurrency = items.reduce((s: number, it: any) => s + (it.priceCurrency ?? 0) * (it.qty ?? 1), 0);
    const order = {
      id,
      userId: payload.userId ?? "demo-user",
      items,
      totalPoints,
      totalCurrency,
      status: payload.payWith === "points" ? "paid" : "pending",
      createdAt: new Date().toISOString(),
    };
    orders.push(order as any);
    // If paid with points, deduct points from user
    if (payload.payWith === "points") {
      const u = users.find((x) => x.id === order.userId);
      if (u) u.points = Math.max(0, u.points - totalPoints);
      // add transaction
      transactions.push({
        id: `tx-${Math.random().toString(36).slice(2, 9)}`,
        userId: order.userId,
        type: "spend",
        amount: -totalPoints,
        description: "Order redemption",
        date: new Date().toISOString(),
      });
    }
    return wrap(order);
  }

  // /rewards/:id/redeem
  const mRedeem = path.match(/^\/rewards\/([^/]+)\/redeem$/);
  if (mRedeem) {
    const rewardId = mRedeem[1];
    const { userId, method } = payload || {};
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) throw new Error("Reward not found");
    const u = users.find((x) => x.id === userId) || users.find((x) => x.id === "demo-user");
    if (!u) throw new Error("User not found");
    if (method === "points") {
      const cost = reward.pointsPrice ?? 0;
      if ((u.points ?? 0) < cost) throw new Error("Insufficient points");
      u.points = u.points - cost;
      // push transaction
      transactions.push({
        id: `tx-${Math.random().toString(36).slice(2, 9)}`,
        userId: u.id,
        type: "spend",
        amount: -cost,
        description: `Redeemed ${reward.title}`,
        date: new Date().toISOString(),
      });
      return wrap({ success: true, redeemed: true });
    } else {
      // currency payment flow would be handled by collectoPayments + confirmation
      return wrap({ success: true, redeemed: false, message: "Pay with card flow required" });
    }
  }

  // /customers/register or /customers/:id/points/credit etc. Not handled here.
  return wrap({ success: true, payload });
}

async function put(path: string, payload?: any) {
  await delay(200);
  // e.g., update services or vendors
  const mSrv = path.match(/^\/services\/([^/]+)$/);
  if (mSrv) {
    const id = mSrv[1];
    const idx = services.findIndex((s) => s.id === id);
    if (idx >= 0) {
      services[idx] = { ...services[idx], ...payload };
      return wrap(services[idx]);
    }
  }
  const mVendor = path.match(/^\/vendors\/([^/]+)$/);
  if (mVendor) {
    const id = mVendor[1];
    const idx = vendors.findIndex((v) => v.id === id);
    if (idx >= 0) {
      vendors[idx] = { ...vendors[idx], ...payload };
      return wrap(vendors[idx]);
    }
  }
  return wrap({ success: true });
}

async function del(path: string) {
  await delay(150);
  const mSrv = path.match(/^\/services\/([^/]+)$/);
  if (mSrv) {
    const id = mSrv[1];
    const i = services.findIndex((s) => s.id === id);
    if (i >= 0) {
      services.splice(i, 1);
      return wrap({ success: true });
    }
  }
  const mVendor = path.match(/^\/vendors\/([^/]+)$/);
  if (mVendor) {
    const id = mVendor[1];
    const i = vendors.findIndex((v) => v.id === id);
    if (i >= 0) {
      vendors.splice(i, 1);
      return wrap({ success: true });
    }
  }
  return wrap({ success: true });
}

export default {
  get,
  post,
  put,
  delete: del,
};
