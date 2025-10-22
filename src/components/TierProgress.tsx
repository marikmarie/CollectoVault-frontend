// src/components/TierProgressNice.tsx
import React from "react";

export type Tier = {
  id: string;
  name: string;
  minPoints: number;
};

type Props = {
  points: number;
  tiers: Tier[];
  className?: string;
  // number of small dots to show between each pair of nodes (0 = none)
  dotsPerSegment?: number;
};

const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));

/**
 * TierProgressNice
 * - Renders a horizontal progress rail with large nodes for each tier.
 * - Small decorative circles (dots) are rendered between nodes to create
 *   an elegant segmented line look.
 *
 * Responsive notes:
 * - On narrow screens the inner container has a min width so the rail becomes
 *   horizontally scrollable instead of cramming nodes.
 */
const TierProgressNice: React.FC<Props> = ({
  points,
  tiers,
  className = "",
  dotsPerSegment = 3,
}) => {
  if (!tiers || tiers.length === 0) return null;

  // Ensure tiers sorted by minPoints ascending
  const sorted = tiers.slice().sort((a, b) => a.minPoints - b.minPoints);

  // find current tier index (highest where points >= minPoints)
  let currentIdx = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (points >= sorted[i].minPoints) currentIdx = i;
  }
  const currentTier = sorted[currentIdx];
  const nextTier = sorted[currentIdx + 1] ?? null;

  // fraction between current tier and next tier, clamped 0..1
  let progressFraction = 1;
  if (nextTier) {
    const span = nextTier.minPoints - currentTier.minPoints;
    progressFraction = span > 0 ? (points - currentTier.minPoints) / span : 1;
    progressFraction = clamp(progressFraction, 0, 1);
  }

  // percent position across the whole rail (0..100)
  const percentAcross = (() => {
    if (!nextTier) return 100;
    const position = (currentIdx + progressFraction) / (sorted.length - 1);
    return clamp(position * 100, 0, 100);
  })();

  // Precompute node positions (percent)
  const nodePercents = sorted.map((_, i) => (i / (sorted.length - 1)) * 100);

  return (
    <div className={`w-full ${className}`}>
      {/* Header: big points + current tier badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="text-xs text-slate-400">Balance</div>
          <div className="text-3xl font-extrabold text-emerald-300">
            {points.toLocaleString()} <span className="text-sm text-slate-400">pts</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400 hidden sm:block text-right">
            <div className="text-xs">Current tier</div>
            <div className="font-semibold text-white">{currentTier.name}</div>
            {nextTier && (
              <div className="text-xs text-slate-400">
                {Math.max(0, nextTier.minPoints - points).toLocaleString()} pts to {nextTier.name}
              </div>
            )}
          </div>

          <div className="px-3 py-2 rounded-full bg-slate-700/60 text-white text-sm font-semibold shadow">
            {currentTier.name}
          </div>
        </div>
      </div>

      {/* Rail container — horizontal scroll on very small screens */}
      <div className="relative overflow-x-auto -mx-4 px-4">
        <div
          className="relative w-full min-w-[560px] md:min-w-0"
          style={{ padding: "1rem 0 2.5rem 0" }}
          aria-hidden={false}
        >
          {/* Background baseline */}
          <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-slate-700" />

          {/* Filled baseline */}
          <div
            className="absolute left-0 top-6 h-1 rounded-full bg-emerald-400"
            style={{
              width: `${percentAcross}%`,
              transition: "width 400ms ease",
            }}
          />

          {/* Decorative small dots between nodes */}
          {dotsPerSegment > 0 &&
            nodePercents.map((p, idx) => {
              if (idx === nodePercents.length - 1) return null;
              const next = nodePercents[idx + 1];
              const seg = next - p;
              const dots = Array.from({ length: dotsPerSegment }, (_, i) => {
                // positions at 25%, 50%, 75% of the segment (or equally spaced)
                const frac = (i + 1) / (dotsPerSegment + 1);
                const left = p + seg * frac;
                const filled = left <= percentAcross;
                return (
                  <span
                    key={`dot-${idx}-${i}`}
                    className={`absolute top-4 w-2 h-2 rounded-full ${filled ? "bg-emerald-300" : "bg-slate-700"}`}
                    style={{ left: `calc(${left}% - 0.5rem)` }}
                  />
                );
              });
              return dots;
            })}

          {/* Nodes (big circles) and labels */}
          {sorted.map((t, i) => {
            const left = nodePercents[i];
            const passed = left <= percentAcross - 0.0001; // small tolerance
            const isCurrent = i === currentIdx;
            const nodeSize = isCurrent ? 14 : 10; // px radius-ish visual
            return (
              <div
                key={t.id}
                className="absolute flex flex-col items-center transform -translate-x-1/2"
                style={{ left: `${left}%`, top: 0 }}
              >
                {/* node circle */}
                <div
                  className={`flex items-center justify-center rounded-full border-2 ${passed ? "bg-emerald-300 border-emerald-300" : "bg-slate-900 border-slate-700"
                    }`}
                  style={{
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                    transition: "all 300ms ease",
                    boxShadow: isCurrent ? "0 6px 18px rgba(16,185,129,0.18)" : undefined,
                  }}
                  aria-label={`${t.name} tier - ${t.minPoints.toLocaleString()} pts`}
                >
                  <span className={`text-xs font-bold ${passed ? "text-slate-900" : "text-slate-300"}`}>
                    {t.name[0]}
                  </span>
                </div>

                {/* small label under node */}
                <div className="mt-3 text-center w-28">
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.minPoints.toLocaleString()} pts</div>
                </div>
              </div>
            );
          })}

          {/* Floating marker for exact progress inside current segment */}
          <div
            className="absolute top-0 pointer-events-none"
            style={{
              left: `${percentAcross}%`,
              transform: "translateX(-50%) translateY(-1.6rem)",
              transition: "left 400ms ease",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-8 bg-emerald-400 rounded" />
              <div className="text-xs bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-md font-semibold shadow">
                {Math.round(progressFraction * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierProgressNice;
