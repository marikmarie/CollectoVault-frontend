// src/features/customer/dashboard/TierProgress.tsx
export default function TierProgress({ tier }: { tier: { name: string; progress: number } }) {
  return (
    <div className="bg-slate-800/60 p-6 rounded-2xl shadow border border-slate-700">
      <p className="text-sm text-slate-400 mb-1">Tier Level</p>
      <div className="text-xl font-semibold mb-3">{tier.name}</div>

      <div className="w-full bg-slate-700 h-3 rounded-full">
        <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${tier.progress}%` }} />
      </div>

      <p className="text-right text-xs text-slate-400 mt-1">{tier.progress}% to next tier</p>
    </div>
  );
}
