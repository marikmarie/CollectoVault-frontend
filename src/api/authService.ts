// src/api/authService.ts
// Auth helpers that use the mockDb. Exposes login/register/logout to the app.

import { users, findUserByEmail } from "./mockDb";
// import vault from "./vaultClient";

const randomToken = () => `tok_${Math.random().toString(36).slice(2, 12)}`;

export async function login(email: string, password: string) {
  // Simulate API call via vault client
  // We'll use simple lookup
  const u = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  await new Promise((r) => setTimeout(r, 350));
  if (!u || u.password !== password) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const token = randomToken();
  return { data: { token, user: { ...u, password: undefined } } };
}

export async function register(payload: { firstName: string; lastName?: string; email: string; phone?: string; password: string }) {
  await new Promise((r) => setTimeout(r, 450));
  const existing = findUserByEmail(payload.email);
  if (existing) {
    const err: any = new Error("User already exists");
    err.status = 400;
    throw err;
  }
  const id = `u_${Math.random().toString(36).slice(2, 9)}`;
  const user = {
    id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: "customer",
    points: 0,
    avatarUrl: null,
  };
  // push to mock users
  (users as any).push(user);
  const token = randomToken();
  return { data: { token, user: { ...user, password: undefined } } };
}

export async function logout() {
  // no-op in mock
  await new Promise((r) => setTimeout(r, 150));
  return { data: { success: true } };
}
