// src/features/customer/TierProgress.tsx
import type { JSX } from "react";

type Tier = { name: string; min: number };

type Props = {
  currentPoints: number;
  tiers: Tier[]; // ascending by min
};

export default function TierProgress({ currentPoints, tiers }: Props): JSX.Element {
  // find current and next tier
  const sorted = [...tiers].sort((a, b) => a.min - b.min);
  let current = sorted[0];
  let next: Tier | null = null;
  for (let i = 0; i < sorted.length; i++) {
    if (currentPoints >= sorted[i].min) current = sorted[i];
    if (sorted[i].min > currentPoints) { next = sorted[i]; break; }
  }

  //const nextMin = next?.min ?? current.min;
  const progress = next ? Math.min(1, (currentPoints - current.min) / (next.min - current.min)) : 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">Tier</div>
          <div className="text-lg font-semibold">{current?.name ?? "Member"}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Points</div>
          <div className="text-lg font-medium">{currentPoints.toLocaleString()}</div>
        </div>
      </div>

      <div className="w-full bg-slate-800/40 rounded-full h-3 overflow-hidden">
        <div style={{ width: `${progress * 100}%` }} className="h-3 bg-emerald-400 rounded-full transition-all" />
      </div>

      {next ? (
        <div className="text-sm text-slate-400">Only <span className="font-medium text-white">{Math.max(0, next.min - currentPoints).toLocaleString()}</span> points to reach <span className="font-semibold">{next.name}</span>.</div>
      ) : (
        <div className="text-sm text-slate-400">You've reached the highest tier — enjoy the benefits!</div>
      )}

      <div className="flex items-center gap-2">
        <button className="px-3 py-1 rounded bg-emerald-500 text-sm text-white">View benefits</button>
        <button className="px-3 py-1 rounded bg-slate-700 text-sm">Tier history</button>
      </div>
    </div>
  );
}
