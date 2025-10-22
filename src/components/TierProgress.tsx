import React from "react";

export type Tier = {
  id: string;
  name: string;
  minPoints: number;
  color?: string; // tailwind color class or hex for custom styling
};

type Props = {
  points: number;
  tiers?: Tier[];
  className?: string;
};

const DEFAULT_TIERS: Tier[] = [
  { id: "blue", name: "Blue", minPoints: 0, color: "bg-slate-600" },
  { id: "silver", name: "Silver", minPoints: 1000, color: "bg-slate-400" },
  { id: "gold", name: "Gold", minPoints: 3000, color: "bg-amber-400" },
  { id: "platinum", name: "Platinum", minPoints: 7000, color: "bg-purple-500" },
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

const TierProgress: React.FC<Props> = ({ points, tiers = DEFAULT_TIERS, className = "" }) => {
  // find current tier index (highest tier where points >= minPoints)
  const sorted = tiers.slice().sort((a, b) => a.minPoints - b.minPoints);
  let currentIdx = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (points >= sorted[i].minPoints) currentIdx = i;
  }

  const currentTier = sorted[currentIdx];
  const nextTier = sorted[currentIdx + 1] ?? null;

  // compute progress fraction between current and next tier
  let progressFraction = 1;
  if (nextTier) {
    const span = nextTier.minPoints - currentTier.minPoints;
    progressFraction = span > 0 ? (points - currentTier.minPoints) / span : 1;
    progressFraction = clamp(progressFraction, 0, 1);
  }

  // percent across whole rail (0 - 100)
  const percentAcross = (() => {
    if (!nextTier) return 100;
    // position = (index + fraction) / (numTiers - 1)
    const pos = (currentIdx + progressFraction) / (sorted.length - 1);
    return clamp(pos * 100, 0, 100);
  })();

  return (
    <div className={`bg-slate-800/60 border border-slate-700 rounded-xl p-4 ${className}`}>
      {/* Header — points + tier */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">Balance</div>
          <div className="text-3xl font-extrabold text-emerald-300 leading-tight">
            {points.toLocaleString()} <span className="text-sm text-slate-400">pts</span>
          </div>
          <div className="text-sm text-slate-400 mt-1">Member since —</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400 text-right hidden sm:block">
            Current tier
            <div className="mt-1 text-white font-semibold">{currentTier.name}</div>
            {nextTier && (
              <div className="text-xs text-slate-400 mt-1">
                {Math.max(0, nextTier.minPoints - points)} pts to {nextTier.name}
              </div>
            )}
          </div>

          {/* tier badge */}
          <div
            className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm ${currentTier.color ?? "bg-slate-600"
              }`}
            aria-hidden
          >
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <div className="text-white">{currentTier.name}</div>
          </div>
        </div>
      </div>

      {/* Progress rail */}
      <div className="mt-5">
        <div
          className="relative w-full overflow-x-auto -mx-4 px-4 py-6"
          // make rail horizontally scrollable on small screens
        >
          {/* The rail background line */}
          <div className="relative w-full h-2 bg-slate-700 rounded-full">
            {/* fill */}
            <div
              className="absolute left-0 top-0 h-2 rounded-full bg-emerald-400"
              style={{ width: `${percentAcross}%`, transition: "width 350ms ease" }}
              aria-hidden
            />
          </div>

          {/* nodes container: Use flex and spaces so nodes line up across the rail */}
          <div
            className="relative mt-4 flex items-center justify-between min-w-[560px] sm:min-w-0"
            // `min-w-[560px]` ensures the nodes don't collapse on mobile; allow horizontal scroll
          >
            {sorted.map((t, i) => {
              // node position label (percent)
              const nodePos = (i / (sorted.length - 1)) * 100;
              const passed = nodePos <= percentAcross;
              const isCurrent = i === currentIdx;
              return (
                <div key={t.id} className="flex-1 text-center relative">
                  {/* vertical connector to line is implicit — place node centred */}
                  <div
                    className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center border-2 ${passed ? "bg-emerald-300 border-emerald-300" : "bg-slate-900 border-slate-700"
                      } ${isCurrent ? "scale-110 ring-2 ring-emerald-300" : ""}`}
                    aria-label={`${t.name} tier ${passed ? "reached" : isCurrent ? "current" : "locked"}`}
                    role="img"
                    title={`${t.name} — ${t.minPoints} pts`}
                    style={{ transition: "all 250ms ease" }}
                  >
                    <span className={`${passed ? "text-slate-900" : "text-slate-300"} text-sm font-bold`}>{t.name[0]}</span>
                  </div>

                  {/* label */}
                  <div className="mt-2 text-xs text-slate-300">{t.name}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{t.minPoints.toLocaleString()} pts</div>
                </div>
              );
            })}
          </div>

          {/* Floating marker (pointer) — positioned absolutely over rail */}
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{ transform: `translateX(${percentAcross}%) translateY(-30px)`, transition: "transform 350ms ease" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-emerald-300 rounded-md" aria-hidden />
              <div className="px-2 py-1 bg-emerald-400 text-slate-900 rounded-md text-xs font-semibold shadow">
                {Math.round(progressFraction * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierProgress;
