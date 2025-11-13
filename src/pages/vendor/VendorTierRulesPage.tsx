import { useEffect, useState, type JSX } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import api from "../../api";
import useSession  from "../../hooks/useSession";

type Tier = {
  id: number;
  vendorId: number;
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

export default function VendorTierRulesPage(): JSX.Element {
  const { user } = useSession();
  const vendorId = user?.id;
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [editing, setEditing] = useState<Tier | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "info" | "success" | "error" } | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    api.get(`/api/vendor/${vendorId}/tier-rules`)
      .then(res => {
        const normalized = res.data.map((t: any) => ({
          id: t.id,
          vendorId: t.vendor_id,
          name: t.name,
          minPoints: t.min_points,
          color: t.color ?? "#94a3b8",
          badgeEmoji: t.badge_emoji ?? "⭐",
          perks: JSON.parse(t.perks || "[]"),
          autoPromote: Boolean(t.auto_promote),
          expiresAfterDays: t.expires_after_days,
          active: Boolean(t.active),
          createdAt: t.created_at
        }));
        setTiers(normalized);
      })
      .catch(() => setToast({ msg: "Failed to load tiers", type: "error" }));
  }, [vendorId]);

  const saveTier = async (payload: Partial<Tier>) => {
    if (!payload.name || payload.minPoints == null) {
      return setToast({ msg: "Name and minimum points required", type: "error" });
    }

    const data = {
      name: payload.name,
      min_points: payload.minPoints,
      color: payload.color,
      badge_emoji: payload.badgeEmoji,
      perks: payload.perks,
      auto_promote: payload.autoPromote,
      expires_after_days: payload.expiresAfterDays,
      active: payload.active ?? true,
    };

    try {
      if (editing) {
        await api.put(`/api/vendor/${vendorId}/tier-rules/${editing.id}`, data);
        setToast({ msg: "Tier updated", type: "success" });
      } else {
        await api.post(`/api/vendor/${vendorId}/tier-rules`, data);
        setToast({ msg: "Tier created", type: "success" });
      }

      const refreshed = await api.get(`/api/vendor/${vendorId}/tier-rules`);
      setTiers(refreshed.data.map((t: any) => ({
        id: t.id,
        vendorId: t.vendor_id,
        name: t.name,
        minPoints: t.min_points,
        color: t.color ?? "#94a3b8",
        badgeEmoji: t.badge_emoji ?? "⭐",
        perks: JSON.parse(t.perks || "[]"),
        autoPromote: Boolean(t.auto_promote),
        expiresAfterDays: t.expires_after_days,
        active: Boolean(t.active),
        createdAt: t.created_at
      })));

    } catch (err: any) {
      return setToast({ msg: err.response?.data?.message || "Failed to save", type: "error" });
    }

    setOpen(false);
    setEditing(null);
  };

  const removeTier = async (id: number) => {
    if (!confirm("Remove this tier? Existing members may be affected.")) return;
    await api.delete(`/api/vendor/${vendorId}/tier-rules/${id}`);
    setTiers((p) => p.filter((t) => t.id !== id));
    setToast({ msg: "Tier removed", type: "info" });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tier Configuration</h1>
          <p className="text-sm text-slate-400">Define loyalty tiers and perks</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>Create tier</Button>
      </div>

      <div className="grid gap-4">
        {tiers.map((t) => (
          <Card key={t.id} className="p-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div style={{ backgroundColor: t.color }} className="w-14 h-14 rounded-lg flex items-center justify-center shadow">
                <div className="text-2xl">{t.badgeEmoji}</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-sm text-slate-400">min {t.minPoints} pts</div>
                <div className="text-sm text-slate-300 mt-1">{t.perks.join(" • ")}</div>
              </div>
            </div>

             <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => { setEditing(t); setOpen(true); }}>Edit</Button>
              <Button variant="ghost" onClick={() => saveTier({ ...t, active: !t.active })}>{t.active ? "Disable" : "Enable"}</Button>
              <Button variant="danger" onClick={() => removeTier(t.id)}>Remove</Button>
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <TierForm initial={editing ?? undefined} onCancel={() => setOpen(false)} onSave={saveTier} />
      )}

      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}

function TierForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Tier>;
  onSave: (p: Partial<Tier>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [minPoints, setMinPoints] = useState(initial?.minPoints ?? 0);
  const [color, setColor] = useState(initial?.color ?? "#94a3b8");
  const [emoji, setEmoji] = useState(initial?.badgeEmoji ?? "⭐");
  const [perksText, setPerksText] = useState((initial?.perks ?? []).join("\n"));
  const [autoPromote, setAutoPromote] = useState(initial?.autoPromote ?? true);
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{initial ? "Edit Tier" : "Create Tier"}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-lg">×</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Tier Name</label>
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-slate-400 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Minimum Points</label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-slate-400 focus:outline-none"
            value={minPoints}
            onChange={(e) => setMinPoints(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Badge Color</label>
          <input
            type="color"
            className="w-full h-10 rounded cursor-pointer bg-slate-800 border border-slate-600"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Emoji</label>
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-center text-xl text-slate-100 focus:border-slate-400 focus:outline-none"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Perks (one per line)</label>
        <textarea
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 h-32 resize-none focus:border-slate-400 focus:outline-none"
          value={perksText}
          onChange={(e) => setPerksText(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300 pt-1">
        <input type="checkbox" checked={autoPromote} onChange={(e) => setAutoPromote(e.target.checked)} />
        Automatically promote customers
      </label>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave({ name, minPoints, color, badgeEmoji: emoji, perks: perksText.split("\n").filter(Boolean), autoPromote })}>
          Save Tier
        </Button>
      </div>
    </div>
  </div>
);

}


