import React from "react";

type Props = {
  currentPoints: number;
  currentTier?: string;
  nextTier?: string;
  nextTierPoints: number; // points required for next tier
  compact?: boolean;
};

export default function TierProgress({ currentPoints, currentTier = "Bronze", nextTier = "Gold", nextTierPoints, compact = false }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((currentPoints / Math.max(1, nextTierPoints)) * 100)));
  const remaining = Math.max(0, nextTierPoints - currentPoints);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="text-xs text-slate-400">Tier</div>
          <div className="font-semibold">{currentTier}</div>
        </div>
        <div className="flex-1">
          <div className="w-full bg-slate-700 h-2 rounded-full">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="text-sm text-slate-300">{pct}%</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/30 p-4 rounded-md border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-slate-400">Tier</div>
          <div className="font-semibold text-lg">{currentTier}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Next</div>
          <div className="font-medium">{nextTier} · {nextTierPoints.toLocaleString()} pts</div>
        </div>
      </div>

      <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
        <div className="h-3 bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 text-sm text-slate-300 flex items-center justify-between">
        <div>{currentPoints.toLocaleString()} pts</div>
        <div>{remaining === 0 ? "Reached" : `${remaining.toLocaleString()} pts to ${nextTier}`}</div>
      </div>
    </div>
  );
}
