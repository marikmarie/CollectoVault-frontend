import type { ReactNode } from "react";

export type Customer = {
  avatarUrl: null;
  firstName: string;
  lastName: ReactNode;
  joined: string;
  nextTierAt: number;
  rank: string;
  recent: any;
  id: string;
  name: string;
  email: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export type Reward = {
  popular: any;
  subtitle: ReactNode;
  id: string;
  title: string;
  description: string;
  points: number;
  image?: string;
}

export const customers: Customer[] = [
  {
    id: 'C001', name: 'Tukas Mariam', email: 'tukas@gmail.com', points: 1240, tier: 'Silver',
    firstName: "",
    lastName: undefined,
    joined: "",
    nextTierAt: 0,
    rank: "",
    recent: undefined,
    avatarUrl: null
  },
  {
    id: 'C002', name: 'Sam Son', email: 'sam@gmail.com', points: 430, tier: 'Bronze',
    firstName: "",
    lastName: undefined,
    joined: "",
    nextTierAt: 0,
    rank: "",
    recent: undefined,
    avatarUrl: null
  },
  {
    id: 'C003', name: 'TM', email: 'tm@gmail.com', points: 3400, tier: 'Gold',
    firstName: "",
    lastName: undefined,
    joined: "",
    nextTierAt: 0,
    rank: "",
    recent: undefined,
    avatarUrl: null
  },
]

export type Staff = {
  avatarUrl: null;
  points: number;
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'clerk'
}

export const staff: Staff[] = [
  {
    id: 'S001', name: 'Dana Mark', email: 'dana@gmail.com', role: 'manager',
    points: 0,
    avatarUrl: null
  },
  {
    id: 'S002', name: 'Evan Martin', email: 'evan@gmail.com', role: 'clerk', points: 0,
    avatarUrl: null
  },
]

export const rewards: Reward[] = [
  {
    id: 'R001', title: '10% Off Voucher', description: 'Get 10% off your next purchase', points: 500,
    popular: undefined,
    subtitle: undefined
  },
  {
    id: 'R002', title: 'Free Coffee', description: 'Redeem for a free coffee', points: 150,
    popular: undefined,
    subtitle: undefined
  },
  {
    id: 'R003', title: 'Voucher: Hotel Stay', description: 'One-night stay voucher', points: 2500,
    popular: undefined,
    subtitle: undefined
  },
]

export const transactions = [
  { id: 'T001', customerId: 'C001', type: 'earn', points: 200, date: '2025-10-18', note: 'Purchase: $45' },
  { id: 'T002', customerId: 'C001', type: 'redeem', points: -150, date: '2025-10-15', note: 'Redeemed: Free Coffee' },
  { id: 'T003', customerId: 'C002', type: 'earn', points: 430, date: '2025-09-21', note: 'Signup bonus' },
]
