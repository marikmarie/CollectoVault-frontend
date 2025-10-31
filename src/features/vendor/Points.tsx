// src/features/vendor/VendorPointRulesPage.tsx
import  { useMemo, useState, type JSX } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import type { ToastType } from "../../components/common/Toast";
import { v4 as uuidv4 } from "uuid";

type TriggerType = "purchase" | "registration" | "birthday" | "referral" | "manual" | "event";

type PointRule = {
  id: string;
  name: string;
  description?: string;
  trigger: TriggerType;
  points: number;
  multiplier?: number;
  maxPerTransaction?: number | null;
  maxPerDay?: number | null;
  active: boolean;
  vendorId: string;
  startAt?: string | null;
  endAt?: string | null;
  createdAt: string;
};

const SAMPLE_RULES: PointRule[] = [
  {
    id: "r-1",
    name: "Standard purchase",
    description: "1 point per UGX 100 spent",
    trigger: "purchase",
    points: 1, // interpret in UI as 1 point per 100UGX (we'll show multiplier usage in UI)
    multiplier: 1,
    maxPerTransaction: null,
    maxPerDay: null,
    active: true,
    vendorId: "v1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r-2",
    name: "Welcome bonus",
    description: "Signup bonus",
    trigger: "registration",
    points: 200,
    multiplier: undefined,
    maxPerTransaction: 200,
    maxPerDay: 200,
    active: true,
    vendorId: "v1",
    createdAt: new Date().toISOString(),
  },
];

export default function VendorPointRulesPage(): JSX.Element {
  const [rules, setRules] = useState<PointRule[]>(SAMPLE_RULES);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<PointRule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const filtered = useMemo(() => {
    if (!search) return rules;
    const q = search.toLowerCase();
    return rules.filter((r) => r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q));
  }, [rules, search]);

  // create or update
  const saveRule = (payload: Partial<PointRule>) => {
    if (!payload.name) { setToast({ msg: "Rule name is required", type: "error" }); return; }
    if (editing) {
      setRules((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...payload, updatedAt: new Date().toISOString() } as PointRule : r)));
      setToast({ msg: "Rule updated", type: "success" });
    } else {
      const newRule: PointRule = {
        id: uuidv4(),
        name: payload.name ?? "Unnamed rule",
        description: payload.description,
        trigger: (payload.trigger || "manual") as TriggerType,
        points: payload.points ?? 0,
        multiplier: payload.multiplier,
        maxPerTransaction: payload.maxPerTransaction ?? null,
        maxPerDay: payload.maxPerDay ?? null,
        active: payload.active ?? true,
        vendorId: "v1",
        startAt: payload.startAt ?? null,
        endAt: payload.endAt ?? null,
        createdAt: new Date().toISOString(),
      };
      setRules((p) => [newRule, ...p]);
      setToast({ msg: "Rule created", type: "success" });
    }
    setShowModal(false);
    setEditing(null);
  };

  const toggleActive = (id: string) => {
    setRules((p) => p.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
    setToast({ msg: "Rule status updated", type: "info" });
  };

  const removeRule = (id: string) => {
    if (!confirm("Remove this rule? This action can be reversed by re-creating it.")) return;
    setRules((p) => p.filter((r) => r.id !== id));
    setToast({ msg: "Rule removed", type: "success" });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Point Rules</h1>
          <p className="text-sm text-slate-400">Define how customers earn points for this vendor</p>
        </div>

        <div className="flex items-center gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rules..." className="px-3 py-2 rounded-md bg-slate-900/50 border border-slate-700 text-sm" />
          <Button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2">Create rule</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && <Card className="p-6 text-center text-slate-400">No rules found.</Card>}

        {filtered.map((r) => (
          <Card key={r.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-sm font-medium ${r.active ? "bg-emerald-600/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>{r.trigger.toUpperCase()}</div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-slate-400">{r.description}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-300 flex gap-4">
                <div>Points: <span className="font-medium text-white">{r.points}</span></div>
                {r.multiplier && <div>Multiplier: <span className="font-medium">{r.multiplier}x</span></div>}
                {r.maxPerDay && <div>Max/day: {r.maxPerDay}</div>}
                {r.startAt && <div>Start: {new Date(r.startAt).toLocaleDateString()}</div>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => { setEditing(r); setShowModal(true); }}>Edit</Button>
              <Button variant="ghost" onClick={() => toggleActive(r.id)}>{r.active ? "Disable" : "Enable"}</Button>
              <Button variant="danger" onClick={() => removeRule(r.id)}>Remove</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal (simple) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">{editing ? "Edit rule" : "Create rule"}</h3>

            <RuleForm initial={editing ?? undefined} onCancel={() => { setShowModal(false); setEditing(null); }} onSave={(payload) => saveRule(payload)} />
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

/* Inline small RuleForm component */
function RuleForm({ initial, onSave, onCancel }: { initial?: Partial<PointRule>, onSave: (payload: Partial<PointRule>) => void, onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [trigger, setTrigger] = useState<TriggerType>((initial?.trigger as TriggerType) ?? "purchase");
  const [points, setPoints] = useState<number>(initial?.points ?? 0);
  const [multiplier, setMultiplier] = useState<number | undefined>(initial?.multiplier);
  const [maxPerDay, setMaxPerDay] = useState<number | "">((initial?.maxPerDay ?? "") as any);
  const [active, setActive] = useState<boolean>(initial?.active ?? true);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm">Rule name</label>
        <input className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm">Description (optional)</label>
        <textarea className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Trigger</label>
          <select className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={trigger} onChange={(e) => setTrigger(e.target.value as TriggerType)}>
            <option value="purchase">Purchase</option>
            <option value="registration">Registration</option>
            <option value="referral">Referral</option>
            <option value="birthday">Birthday</option>
            <option value="manual">Manual</option>
            <option value="event">Event</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Points</label>
          <input type="number" min={0} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
        </div>

        <div>
          <label className="block text-sm">Multiplier (optional)</label>
          <input type="number" min={0} step="0.1" className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={multiplier ?? ""} onChange={(e) => setMultiplier(e.target.value === "" ? undefined : Number(e.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Max per day (optional)</label>
          <input type="number" min={0} className="w-full px-3 py-2 rounded bg-slate-900/50 border border-slate-700" value={maxPerDay as any} onChange={(e) => setMaxPerDay(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>

        <div className="flex items-end justify-end gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave({ name, description: desc, trigger, points, multiplier, maxPerDay: maxPerDay === "" ? null : (maxPerDay as number), active })}>Save rule</Button>
      </div>
    </div>
  );
}
