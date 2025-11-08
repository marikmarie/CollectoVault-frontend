// src/features/customer/dashboard/TierProgress.tsx
import type { JSX } from "react";
import { useMemo } from "react";

/**
 * Props:
 * - tiers: [{ id, name, min_points }]
 * - currentPoints: number
 */

type Tier = { id: number; name: string; min_points: number; benefits?: any };
type Props = { tiers: Tier[]; currentPoints: number };

export default function TierProgress({ tiers, currentPoints }: Props): JSX.Element {
  // sort tiers by min_points asc
  const sorted = useMemo(() => [...tiers].sort((a, b) => a.min_points - b.min_points), [tiers]);

  if (!sorted.length) {
    return (
      <div className="text-sm text-slate-400">No tiers configured yet for this business.</div>
    );
  }

  // find current tier index
  let currentIdx = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (currentPoints >= sorted[i].min_points) currentIdx = i;
  }
  const currentTier = sorted[currentIdx];
  const nextTier = sorted[currentIdx + 1] ?? null;
  const progress = nextTier ? Math.min(100, Math.round(((currentPoints - currentTier.min_points) / (nextTier.min_points - currentTier.min_points)) * 100)) : 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-slate-300">Current tier</div>
          <div className="text-lg font-semibold">{currentTier.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Points</div>
          <div className="font-medium">{currentPoints.toLocaleString()}</div>
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div className="h-3 rounded-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        <div>{currentTier.min_points.toLocaleString()} pts</div>
        <div>{nextTier ? `${nextTier.min_points.toLocaleString()} pts` : "Max"}</div>
      </div>

      {nextTier && (
        <div className="mt-3 text-sm text-slate-300">
          You need <span className="font-medium">{(nextTier.min_points - currentPoints).toLocaleString()}</span> more points to reach <span className="font-semibold">{nextTier.name}</span>.
        </div>
      )}
    </div>
  );
}
