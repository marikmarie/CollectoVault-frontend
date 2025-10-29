// src/api/mockDb.ts
// In-memory mock database for demo usage. Not persisted.

//import { i } from "framer-motion/client";

export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  role?: "customer" | "vendor" | "admin";
  points: number;
  avatarUrl?: string | null;
};

export type Vendor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  approved?: boolean;
  active?: boolean;
  createdAt: string;
};

export type Service = {
  id: string;
  vendorId: string;
  title: string;
  description?: string;
  pricePoints?: number | null;
  priceCurrency?: number | null;
  imageUrl?: string | null;
  active?: boolean;
  createdAt: string;
};

export type Reward = {
  id: string;
  serviceId?: string;
  title: string;
  description?: string;
  pointsPrice?: number | null;
  currencyPrice?: number | null;
  vendorId?: string;
  tags?: string[];
  availability?: "available" | "soldout" | "coming_soon";
};

export type Transaction = {
  id: string;
  userId: string;
  type: "earn" | "spend" | "purchase";
  amount: number; // points if type is earn/spend, currency for purchase
  currency?: string;
  description?: string;
  date: string;
};

export type Order = {
  id: string;
  userId: string;
  items: Array<{ id: string; title: string; qty?: number; pricePoints?: number | null; priceCurrency?: number | null; vendorId?: string }>;
  totalPoints?: number;
  totalCurrency?: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  createdAt: string;
};

const now = () => new Date().toISOString();

export const users: User[] = [
  {
    id: "demo-user",
    firstName: "Demo",
    lastName: "User",
    email: "demo@collecto.test",
    phone: "+256700000000",
    password: "password",
    role: "customer",
    points: 1240,
    avatarUrl: null,
  },
  {
    id: "vendor-user",
    firstName: "Forest",
    lastName: "Mall",
    email: "vendor@forestmall.com",
    password: "password",
    role: "vendor",
    points: 0,
    avatarUrl: null,
  },
  {
    id: "admin-user",
    firstName: "Admin",
    email: "admin@collecto.test",
    password: "password",
    role: "admin",
    points: 0,
    avatarUrl: null,
  },
];

export const vendors: Vendor[] = [
  { id: "v1", name: "Forest Park Resort", email: "hello@forestparkresort.com", phone: "+256700111222", approved: true, active: true, createdAt: now() },
  { id: "v2", name: "Lakeview Restaurant", email: "hello@lakeview.com", phone: "+256700222333", approved: true, active: true, createdAt: now() },
  { id: "v3", name: "Sunrise Spa", email: "spa@sunrise.com", phone: "+256700333444", approved: false, active: false, createdAt: now() },
];

export const services: Service[] = [
  {
    id: "s1",
    vendorId: "v1",
    title: "2-hour Spa Voucher",
    description: "Relaxing 2-hour spa session",
    pricePoints: 1200,
    priceCurrency: 25000,
    active: true,
    imageUrl: "images/spa.png",
    createdAt: now(),
  },
  {
    id: "s2",
    vendorId: "v2",
    title: "Dinner for Two",
    description: "Three-course dinner menu",
    pricePoints: 800,
    priceCurrency: 10000,
    active: true,
    imageUrl: "/images/dinner.png",
    createdAt: now(),
  },
  {
    id: "s3",
    vendorId: "v1",
    title: "Room Discount 20%",
    description: "Weekday stays only",
    pricePoints: 2000,
    priceCurrency: 50000,
    active: false,
    imageUrl: "images/room.png",
    createdAt: now(),
  },
];

export const rewards: Reward[] = services.map((s) => ({
  id: `r-${s.id}`,
  serviceId: s.id,
  title: s.title,
  description: s.description,
  pointsPrice: s.pricePoints ?? null,
  currencyPrice: s.priceCurrency ?? null,
  vendorId: s.vendorId,
  tags: s.pricePoints && s.pricePoints <= 1000 ? ["popular"] : [],
  availability: s.active ? "available" : "coming_soon",
}));

export const transactions: Transaction[] = [
  { id: "t1", userId: "demo-user", type: "earn", amount: 200, description: "Promo bonus", date: now() },
  { id: "t2", userId: "demo-user", type: "spend", amount: -1200, description: "Spa voucher redemption", date: new Date(Date.now() - 86400000).toISOString() },
];

export const orders: Order[] = [];

export const payments: Array<{ transactionId: string; amount: number; currency: string; status: "pending" | "completed" | "failed"; createdAt: string }> = [];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id);
}
