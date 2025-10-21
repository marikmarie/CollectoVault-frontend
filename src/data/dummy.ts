export type Customer = {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
}

export type Reward = {
  id: string;
  title: string;
  description: string;
  points: number;
  image?: string;
}

export const customers: Customer[] = [
  { id: 'C001', name: 'Alice Johnson', email: 'alice@example.com', points: 1240, tier: 'Silver' },
  { id: 'C002', name: 'Bob Smith', email: 'bob@example.com', points: 430, tier: 'Bronze' },
  { id: 'C003', name: 'Carol Mills', email: 'carol@example.com', points: 3400, tier: 'Gold' },
]

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'clerk'
}

export const staff: Staff[] = [
  { id: 'S001', name: 'Dana Lewis', email: 'dana@example.com', role: 'manager' },
  { id: 'S002', name: 'Evan Parker', email: 'evan@example.com', role: 'clerk' },
]

export const rewards: Reward[] = [
  { id: 'R001', title: '10% Off Voucher', description: 'Get 10% off your next purchase', points: 500 },
  { id: 'R002', title: 'Free Coffee', description: 'Redeem for a free coffee', points: 150 },
  { id: 'R003', title: 'Voucher: Hotel Stay', description: 'One-night stay voucher', points: 2500 },
]

export const transactions = [
  { id: 'T001', customerId: 'C001', type: 'earn', points: 200, date: '2025-10-18', note: 'Purchase: $45' },
  { id: 'T002', customerId: 'C001', type: 'redeem', points: -150, date: '2025-10-15', note: 'Redeemed: Free Coffee' },
  { id: 'T003', customerId: 'C002', type: 'earn', points: 430, date: '2025-09-21', note: 'Signup bonus' },
]
