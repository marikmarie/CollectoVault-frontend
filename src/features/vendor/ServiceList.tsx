/* src/features/vendor/ServiceList.tsx */
import  { useEffect, useState, type JSX } from "react";
import vendorsService from "../../api/vendorsService";
import { Link, useNavigate } from "react-router-dom";

type Service = {
  id: string;
  title: string;
  description?: string;
  pricePoints?: number;
  priceCurrency?: number;
  active?: boolean;
  createdAt?: string;
};

export default function ServiceList(): JSX.Element {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if ((vendorsService as any)?.getMyServices) {
          const res = await (vendorsService as any).getMyServices();
          const data = res?.data ?? res;
          if (mounted) setServices(data || []);
        } else {
          // fallback demo list
          if (mounted) {
            setServices([
              { id: "s1", title: "Spa voucher", description: "Relaxing 2-hour spa", pricePoints: 1200, priceCurrency: 15, active: true, createdAt: new Date().toISOString() },
              { id: "s2", title: "Dinner for two", description: "Includes dessert", pricePoints: 800, priceCurrency: 10, active: true, createdAt: new Date().toISOString() },
            ]);
          }
        }
      } catch (err: any) {
        console.warn("Failed fetching services", err);
        if (mounted) {
          setError("Failed to load services. Showing demo list.");
          setServices([{ id: "s-demo", title: "Demo service", description: "Demo description", pricePoints: 500, priceCurrency: 6, active: true, createdAt: new Date().toISOString() }]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleActive = async (id: string, next: boolean) => {
    setBusyId(id);
    try {
      if ((vendorsService as any)?.updateService) {
        await (vendorsService as any).updateService(id, { active: next });
        setServices((s) => s.map(x => x.id === id ? { ...x, active: next } : x));
      } else {
        // demo fallback: immediate local toggle
        setServices((s) => s.map(x => x.id === id ? { ...x, active: next } : x));
      }
    } catch (err: any) {
      console.error("toggle active failed", err);
      setError("Failed to update service");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service? This action cannot be undone.")) return;
    setBusyId(id);
    try {
      if ((vendorsService as any)?.deleteService) {
        await (vendorsService as any).deleteService(id);
        setServices((s) => s.filter(x => x.id !== id));
      } else {
        setServices((s) => s.filter(x => x.id !== id));
      }
    } catch (err: any) {
      console.error("delete failed", err);
      setError("Failed to delete service");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Services</h2>
          <p className="text-sm text-slate-300">Manage, edit, or remove services offered to customers.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/vendor/upload" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white">New service</Link>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-400">Loading services...</div>
        ) : error ? (
          <div className="p-4 text-sm text-rose-400">{error}</div>
        ) : services.length === 0 ? (
          <div className="p-6 text-center text-slate-400">No services yet. Upload one to begin accepting redemptions.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-slate-300">Service</th>
                <th className="px-4 py-3 text-left text-sm text-slate-300">Price</th>
                <th className="px-4 py-3 text-left text-sm text-slate-300">Status</th>
                <th className="px-4 py-3 text-right text-sm text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-slate-800">
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-slate-400">{s.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{s.pricePoints ? `${s.pricePoints} pts` : "—"}</div>
                    <div className="text-xs text-slate-400">{s.priceCurrency ? `$${s.priceCurrency}` : ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${s.active ? "bg-emerald-600" : "bg-slate-700"}`}>{s.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => toggleActive(s.id, !s.active)} disabled={busyId === s.id} className="px-3 py-1 text-sm rounded border border-slate-700 hover:bg-slate-800">
                        {s.active ? "Disable" : "Activate"}
                      </button>
                      <button onClick={() => navigate(`/vendor/services/${s.id}/edit`)} className="px-3 py-1 text-sm rounded border border-slate-700 hover:bg-slate-800">Edit</button>
                      <button onClick={() => remove(s.id)} disabled={busyId === s.id} className="px-3 py-1 text-sm rounded bg-rose-500 hover:bg-rose-600 text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
