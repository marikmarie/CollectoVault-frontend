/* src/features/vendor/VendorPointRulesPage.tsx */
import  { useEffect, useMemo, useState, type JSX } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import type { ToastType } from "../../components/common/Toast";
import Spinner from "../../components/common/Spinner";
import api from "../../api";
import { useSession } from "../../hooks/useSession";

type TriggerType =
  | "purchase"
  | "registration"
  | "birthday"
  | "referral"
  | "manual"
  | "event";

type PointRule = {
  id: string;
  name: string;
  description?: string | null;
  trigger: TriggerType;
  points: number;
  multiplier?: number | null;
  maxPerTransaction?: number | null;
  maxPerDay?: number | null;
  active: boolean;
  vendorId: string;
  startAt?: string | null;
  endAt?: string | null;
  createdAt: string;
};

export default function VendorPointRulesPage(): JSX.Element {
  const { user, loading: sessionLoading } = useSession() as any;

  const [rules, setRules] = useState<PointRule[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<PointRule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [busyRuleId, setBusyRuleId] = useState<string | null>(null);
  const vendorId = user?.id ?? null;

  // map API row (snake_case) -> UI PointRule
  function mapFromApi(r: any): PointRule {
    return {
      id: String(r.id),
      name: r.name,
      description: r.description ?? null,
      trigger: (r.trigger as TriggerType),
      points: Number(r.points ?? 0),
      multiplier:
        r.multiplier === null || r.multiplier === undefined
          ? null
          : Number(r.multiplier),
      maxPerTransaction:
        r.max_per_transaction === null || r.max_per_transaction === undefined
          ? null
          : Number(r.max_per_transaction),
      maxPerDay:
        r.max_per_day === null || r.max_per_day === undefined
          ? null
          : Number(r.max_per_day),
      active: !!r.active,
      vendorId: String(r.vendor_id ?? vendorId ?? ""),
      startAt: r.start_at ?? null,
      endAt: r.end_at ?? null,
      createdAt: r.created_at ?? new Date().toISOString(),
    };
  }

  // fetch rules
  const fetchRules = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/vendor/${vendorId}/point-rules`);
      // data expected to be an array
      const arr = (data || []) as any[];
      setRules(arr.map(mapFromApi));
    } catch (err: any) {
      console.error("Failed to load point rules", err);
      setToast({
        msg: "Failed to load rules. See console for details.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!vendorId) {
      setRules([]);
      setLoading(false);
      return;
    }
    fetchRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, sessionLoading]);

  const filtered = useMemo(() => {
    if (!search) return rules;
    const q = search.toLowerCase();
    return rules.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  }, [rules, search]);

  // create or update
  const saveRule = async (payload: Partial<PointRule>) => {
    if (!vendorId) {
      setToast({ msg: "Vendor not available", type: "error" });
      return;
    }
    if (!payload.name || payload.name.trim().length === 0) {
      setToast({ msg: "Rule name is required", type: "error" });
      return;
    }

    try {
      setBusyRuleId("saving");
      if (editing) {
        // update existing
        const body = {
          name: payload.name,
          description: payload.description ?? null,
          trigger: payload.trigger ?? "manual",
          points: payload.points ?? 0,
          multiplier:
            payload.multiplier === undefined ? null : payload.multiplier,
          max_per_transaction:
            payload.maxPerTransaction === undefined
              ? null
              : payload.maxPerTransaction,
          max_per_day:
            payload.maxPerDay === undefined ? null : payload.maxPerDay,
          active: payload.active ? 1 : 0,
          start_at: payload.startAt ?? null,
          end_at: payload.endAt ?? null,
        };
        await api.put(
          `/api/vendor/${vendorId}/point-rules/${editing.id}`,
          body
        );
        setToast({ msg: "Rule updated", type: "success" });
      } else {
        // create new
        const body = {
          name: payload.name,
          description: payload.description ?? null,
          trigger: payload.trigger ?? "manual",
          points: payload.points ?? 0,
          multiplier:
            payload.multiplier === undefined ? null : payload.multiplier,
          max_per_transaction:
            payload.maxPerTransaction === undefined
              ? null
              : payload.maxPerTransaction,
          max_per_day:
            payload.maxPerDay === undefined ? null : payload.maxPerDay,
          active: payload.active ? 1 : 1,
          start_at: payload.startAt ?? null,
          end_at: payload.endAt ?? null,
        };
        await api.post(`/api/vendor/${vendorId}/point-rules`, body);
        setToast({ msg: "Rule created", type: "success" });
      }

      // refresh list
      await fetchRules();
      setShowModal(false);
      setEditing(null);
    } catch (err: any) {
      console.error("Save rule failed", err);
      setToast({
        msg: err?.message ?? "Failed to save rule",
        type: "error",
      });
    } finally {
      setBusyRuleId(null);
    }
  };

  const toggleActive = async (id: string) => {
    if (!vendorId) return;
    const r = rules.find((x) => x.id === id);
    if (!r) return;
    try {
      setBusyRuleId(id);
      const body = {
        name: r.name,
        description: r.description ?? null,
        trigger: r.trigger,
        points: r.points ?? 0,
        multiplier: r.multiplier ?? null,
        max_per_transaction: r.maxPerTransaction ?? null,
        max_per_day: r.maxPerDay ?? null,
        active: r.active ? 0 : 1,
        start_at: r.startAt ?? null,
        end_at: r.endAt ?? null,
      };
      await api.put(`/api/vendor/${vendorId}/point-rules/${id}`, body);
      await fetchRules();
      setToast({ msg: "Rule status updated", type: "info" });
    } catch (err: any) {
      console.error("Toggle active failed", err);
      setToast({ msg: "Failed to update rule", type: "error" });
    } finally {
      setBusyRuleId(null);
    }
  };

  const removeRule = async (id: string) => {
    if (!confirm("Remove this rule? This action can be reversed by re-creating it.")) return;
    if (!vendorId) return;
    try {
      setBusyRuleId(id);
      await api.delete(`/api/vendor/${vendorId}/point-rules/${id}`);
      await fetchRules();
      setToast({ msg: "Rule removed", type: "success" });
    } catch (err: any) {
      console.error("Delete rule failed", err);
      setToast({ msg: "Failed to remove rule", type: "error" });
    } finally {
      setBusyRuleId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Point Rules</h1>
          <p className="text-sm text-slate-400">Define how customers earn points for this vendor</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rules..."
            className="px-3 py-2 rounded-md bg-slate-900/50 border border-slate-700 text-sm"
          />
          <Button
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
            className="px-4 py-2"
          >
            Create rule
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card className="p-6 text-center"><Spinner /></Card>
        ) : filtered.length === 0 ? (
          <Card className="p-6 text-center text-slate-400">No rules found.</Card>
        ) : (
          filtered.map((r) => (
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
                  {r.multiplier != null && <div>Multiplier: <span className="font-medium">{r.multiplier}x</span></div>}
                  {r.maxPerDay != null && <div>Max/day: {r.maxPerDay}</div>}
                  {r.startAt && <div>Start: {new Date(r.startAt).toLocaleDateString()}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => { setEditing(r); setShowModal(true); }}>Edit</Button>
                <Button variant="ghost" onClick={() => toggleActive(r.id)} disabled={busyRuleId === r.id}>
                  {r.active ? "Disable" : "Enable"}
                </Button>
                <Button variant="danger" onClick={() => removeRule(r.id)} disabled={busyRuleId === r.id}>Remove</Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">{editing ? "Edit rule" : "Create rule"}</h3>
            <RuleForm
              initial={editing ?? undefined}
              onCancel={() => { setShowModal(false); setEditing(null); }}
              onSave={(payload) => saveRule(payload)}
              saving={busyRuleId === "saving"}
            />
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
function RuleForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<PointRule>;
  onSave: (payload: Partial<PointRule>) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [trigger, setTrigger] = useState<TriggerType>((initial?.trigger as TriggerType) ?? "purchase");
  const [points, setPoints] = useState<number>(initial?.points ?? 0);
  const [multiplier, setMultiplier] = useState<number | undefined>(initial?.multiplier ?? undefined);
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
        <Button onClick={() => onSave({
          name,
          description: desc,
          trigger,
          points,
          multiplier,
          maxPerDay: maxPerDay === "" ? null : (maxPerDay as number),
          active
        })} loading={saving}>{saving ? "Saving..." : "Save rule"}</Button>
      </div>
    </div>
  );
}
