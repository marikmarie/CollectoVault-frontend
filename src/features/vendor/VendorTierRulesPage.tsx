// src/features/vendor/VendorTierRulesPage.tsx
import React, { useState, type JSX } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import { v4 as uuidv4 } from "uuid";

type Tier = {
  id: string;
  vendorId: string;
  name: string;
  minPoints: number;
  color?: string;
  badgeEmoji?: string;
  perks: string[];
  autoPromote: boolean;
  expiresAfterDays?: number | null;
  active: boolean;
  createdAt: string;
};

const SAMPLE_TIERS: Tier[] = [
  { id: "t1", vendorId: "v1", name: "Bronze", minPoints: 0, color: "#b45309", badgeEmoji: "🥉", perks: ["Welcome discount 5%"], autoPromote: true, expiresAfterDays: null, active: true, createdAt: new Date().toISOString() },
  { id: "t2", vendorId: "v1", name: "Silver", minPoints: 1000, color: "#94a3b8", badgeEmoji: "🥈", perks: ["Priority check-in", "10% discount"], autoPromote: true, expiresAfterDays: 365, active: true, createdAt: new Date().toISOString() },
  { id: "t3", vendorId: "v1", name: "Gold", minPoints: 3000, color: "#f59e0b", badgeEmoji: "🥇", perks: ["Free upgrade", "15% discount"], autoPromote: true, expiresAfterDays: 365, active: true, createdAt: new Date().toISOString() },
];

export default function VendorTierRulesPage(): JSX.Element {
  const [tiers, setTiers] = useState<Tier[]>(SAMPLE_TIERS);
  const [editing, setEditing] = useState<Tier | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "info" | "success" | "error" } | null>(null);

  const saveTier = (payload: Partial<Tier>) => {
    if (!payload.name) { setToast({ msg: "Tier name required", type: "error" }); return; }
    if (!payload.minPoints && payload.minPoints !== 0) { setToast({ msg: "Minimum points required (0 allowed)", type: "error" }); return; }

    if (editing) {
      setTiers((p) => p.map((t) => (t.id === editing.id ? { ...t, ...payload, updatedAt: new Date().toISOString() } as Tier : t)));
      setToast({ msg: "Tier updated", type: "success" });
    } else {
      const nt: Tier = {
        id: uuidv4(),
        vendorId: "v1",
        name: payload.name ?? "New Tier",
        minPoints: payload.minPoints ?? 0,
        color: payload.color ?? "#94a3b8",
        badgeEmoji: payload.badgeEmoji ?? "⭐",
        perks: payload.perks ?? [],
        autoPromote: payload.autoPromote ?? true,
        expiresAfterDays: payload.expiresAfterDays ?? null,
        active: payload.active ?? true,
        createdAt: new Date().toISOString(),
      };
      setTiers((p) => [...p, nt].sort((a, b) => a.minPoints - b.minPoints));
      setToast({ msg: "Tier created", type: "success" });
    }
    setOpen(false);
    setEditing(null);
  };

  const removeTier = (id: string) => {
    if (!confirm("Remove this tier? Existing members may be affected.")) return;
    setTiers((p) => p.filter((t) => t.id !== id));
    setToast({ msg: "Tier removed", type: "info" });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tier Configuration</h1>
          <p className="text-sm text-slate-400">Define loyalty tiers and perks for customers</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => { setEditing(null); setOpen(true); }}>Create tier</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {tiers.map((t) => (
          <Card key={t.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div style={{ backgroundColor: t.color }} className="w-14 h-14 rounded-lg flex items-center justify-center shadow">
                <div className="text-2xl">{t.badgeEmoji}</div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-lg">{t.name}</div>
                  <div className="text-sm text-slate-400">min {t.minPoints.toLocaleString()} pts</div>
                </div>
                <div className="text-sm text-slate-300 mt-1">{t.perks.join(" • ")}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => { setEditing(t); setOpen(true); }}>Edit</Button>
              <Button variant="ghost" onClick={() => setTiers((p) => p.map((x) => x.id === t.id ? { ...x, active: !x.active } : x))}>{t.active ? "Disable" : "Enable"}</Button>
              <Button variant="danger" onClick={() => removeTier(t.id)}>Remove</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-6">
            <TierForm initial={editing ?? undefined} onCancel={() => { setOpen(false); setEditing(null); }} onSave={saveTier} />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}

/* Inline tier form */
function TierForm({ initial, onSave, onCancel }: { initial?: Partial<Tier>, onSave: (p: Partial<Tier>) => void, onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [minPoints, setMinPoints] = useState<number>(initial?.minPoints ?? 0);
  const [color, setColor] = useState(initial?.color ?? "#94a3b8");
  const [emoji, setEmoji] = useState(initial?.badgeEmoji ?? "⭐");
  const [perksText, setPerksText] = useState((initial?.perks ?? []).join("\n"));
  const [autoPromote, setAutoPromote] = useState(initial?.autoPromote ?? true);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm">Tier name</label>
        <input className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Minimum points</label>
          <input type="number" className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={minPoints} onChange={(e) => setMinPoints(Number(e.target.value))} />
        </div>

        <div>
          <label className="block text-sm">Badge color</label>
          <input className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm">Emoji</label>
          <input className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm">Perks (one per line)</label>
        <textarea className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" rows={4} value={perksText} onChange={(e) => setPerksText(e.target.value)} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoPromote} onChange={(e) => setAutoPromote(e.target.checked)} />
          <span className="text-sm">Auto-promote members</span>
        </label>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave({ name, minPoints, color, badgeEmoji: emoji, perks: perksText.split("\n").map(s => s.trim()).filter(Boolean), autoPromote, active: true })}>Save tier</Button>
        </div>
      </div>
    </div>
  );
}
