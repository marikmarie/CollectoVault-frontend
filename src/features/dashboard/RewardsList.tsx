// src/features/customer/dashboard/RewardsList.tsx
import type { JSX } from "react";
import { useMemo } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

type Reward = {
  id: number;
  points_cost: number;
  description: string;
  expiry?: string | null;
};

type Props = {
  rewards: Reward[];
  currentPoints: number;
  onRedeem: (rewardId: number) => Promise<void> | void;
};

export default function RewardsList({ rewards, currentPoints, onRedeem }: Props): JSX.Element {
  const sorted = useMemo(() => [...rewards].sort((a, b) => a.points_cost - b.points_cost), [rewards]);

  if (!sorted.length) return <div className="text-sm text-slate-400">No rewards available yet.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sorted.map((r) => (
        <Card key={r.id} className="p-4 flex flex-col justify-between">
          <div>
            <div className="text-sm text-slate-300">Reward</div>
            <div className="text-lg font-semibold mt-1">{r.description}</div>
            {r.expiry && <div className="text-xs text-slate-400 mt-1">Expires: {new Date(r.expiry).toLocaleDateString()}</div>}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-300">{r.points_cost.toLocaleString()} pts</div>
            <Button onClick={() => onRedeem(r.id)} disabled={currentPoints < r.points_cost}>
              {currentPoints < r.points_cost ? "Not enough points" : "Redeem"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
