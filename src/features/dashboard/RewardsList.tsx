// src/features/customer/RewardsList.tsx
import type { JSX } from "react";
import { useState } from "react";
import api from "../../api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

type Reward = {
  id: number | string;
  title: string;
  description?: string;
  cost: number;
  stock?: number;
  image?: string;
};

type Props = {
  rewards: Reward[];
  points?: number;
  onRedeemed?: () => void; // optional callback to refresh
};

export default function RewardsList({ rewards, points = 0, onRedeemed }: Props): JSX.Element {
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function redeem(reward: Reward) {
    if (points < reward.cost) {
      setMessage("Not enough points to redeem this reward");
      return;
    }
    setProcessingId(reward.id);
    setMessage(null);
    try {
      // Call Vault endpoint to redeem (backend should handle wallet/ticket creation)
      await api.post("/api/rewards/redeem", { rewardId: reward.id });
      setMessage("Reward redeemed — check your inbox for details");
      if (onRedeemed) onRedeemed();
    } catch (err: any) {
      setMessage(err?.message ?? "Unable to redeem reward");
    } finally {
      setProcessingId(null);
    }
  }

  if (!rewards || rewards.length === 0) {
    return <div className="text-sm text-slate-400">No rewards available at the moment.</div>;
  }

  return (
    <div className="space-y-3">
      {rewards.map((r) => (
        <Card key={String(r.id)} className="p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded overflow-hidden flex items-center justify-center">
              {r.image ? <img src={r.image} alt={r.title} className="w-full h-full object-cover" /> : <div className="text-slate-400">{r.title.charAt(0)}</div>}
            </div>
            <div>
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="text-xs text-slate-400">{r.description}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-sm text-slate-300">{r.cost.toLocaleString()} pts</div>
            <Button
              disabled={processingId !== null}
              onClick={() => redeem(r)}
              className="px-3 py-1 text-sm"
            >
              {processingId === r.id ? "Processing..." : (points >= r.cost ? "Redeem" : "Not enough pts")}
            </Button>
          </div>
        </Card>
      ))}

      {message && <div className="text-sm text-amber-300">{message}</div>}
    </div>
  );
}
