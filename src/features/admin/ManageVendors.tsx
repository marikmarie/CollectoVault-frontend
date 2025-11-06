// src/pages/admin/ManageVendors.tsx
import  { useEffect, useMemo, useState, type JSX } from "react";
// import MainLayout from "../../components/layout/MainLayout";
import {vendorService} from "../../api/vendorService";
import { Link } from "react-router-dom";

type Vendor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  approved?: boolean;
  active?: boolean;
  createdAt?: string;
};

export default function ManageVendors(): JSX.Element {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if ((vendorService as any)?.getAllVendors) {
          const resp = await (vendorService as any).getAllVendors();
          const data = resp?.data ?? resp;
          if (!mounted) return;
          setVendors(data || []);
        } else {
          // demo list
          if (!mounted) return;
          setVendors([
            { id: "v1", name: "Forest Mall", email: "contact@forestmall.com", phone: "+256700111222", approved: true, active: true, createdAt: new Date().toISOString() },
            { id: "v2", name: "Lakeview Restaurant", email: "hello@lakeview.com", phone: "+256700222333", approved: false, active: true, createdAt: new Date().toISOString() },
            { id: "v3", name: "Sunrise Spa", email: "spa@sunrise.com", phone: "+256700333444", approved: false, active: false, createdAt: new Date().toISOString() },
          ]);
        }
      } catch (err: any) {
        console.warn("getAllVendors failed", err);
        if (mounted) {
          setError("Failed to load vendors. Showing demo list.");
          setVendors([{ id: "v-demo", name: "Demo Vendor", email: "demo@example.com", approved: true, active: true, createdAt: new Date().toISOString() }]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!q) return vendors;
    return vendors.filter(v => v.name.toLowerCase().includes(q.toLowerCase()) || (v.email || "").toLowerCase().includes(q.toLowerCase()));
  }, [vendors, q]);

  const toggleActive = async (id: string, next: boolean) => {
    setBusyId(id);
    try {
      if ((vendorService as any)?.updateVendor) {
        await (vendorService as any).updateVendor(id, { active: next });
        setVendors(s => s.map(v => v.id === id ? { ...v, active: next } : v));
      } else {
        setVendors(s => s.map(v => v.id === id ? { ...v, active: next } : v));
      }
    } catch (err) {
      console.error("toggle active failed", err);
      setError("Failed to update vendor");
    } finally {
      setBusyId(null);
    }
  };

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      if ((vendorService as any)?.approveVendor) {
        await (vendorService as any).approveVendor(id);
        setVendors(s => s.map(v => v.id === id ? { ...v, approved: true } : v));
      } else {
        setVendors(s => s.map(v => v.id === id ? { ...v, approved: true } : v));
      }
    } catch (err) {
      console.error("approve vendor failed", err);
      setError("Failed to approve vendor");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete vendor? This will remove all related data in demo. Proceed?")) return;
    setBusyId(id);
    try {
      if ((vendorService as any)?.deleteVendor) {
        await (vendorService as any).deleteVendor(id);
        setVendors(s => s.filter(v => v.id !== id));
      } else {
        setVendors(s => s.filter(v => v.id !== id));
      }
    } catch (err) {
      console.error("delete failed", err);
      setError("Failed to delete vendor");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full max-w-md">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendors by name or email" className="w-full rounded px-3 py-2 bg-slate-900/40 border border-slate-700" />
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/vendors/new" className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white">New vendor</Link>
          <button onClick={() => { /* placeholder export */ alert("Exporting CSV (demo)"); }} className="px-3 py-2 border rounded">Export</button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-400">Loading vendors...</div>
        ) : error ? (
          <div className="p-4 text-sm text-rose-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-slate-400">No vendors match your search.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-slate-300">Vendor</th>
                <th className="px-4 py-3 text-left text-sm text-slate-300">Contact</th>
                <th className="px-4 py-3 text-left text-sm text-slate-300">Status</th>
                <th className="px-4 py-3 text-right text-sm text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-slate-800">
              {filtered.map(v => (
                <tr key={v.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-slate-400">Joined {new Date(v.createdAt || Date.now()).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{v.email ?? "—"}</div>
                    <div className="text-xs text-slate-400">{v.phone ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${v.approved ? "bg-emerald-600" : "bg-amber-600"}`}>{v.approved ? "Approved" : "Pending"}</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${v.active ? "bg-emerald-500" : "bg-slate-700"}`}>{v.active ? "Active" : "Disabled"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {!v.approved && (
                        <button disabled={busyId === v.id} onClick={() => approve(v.id)} className="px-3 py-1 text-sm rounded bg-emerald-500 text-white">Approve</button>
                      )}
                      <button onClick={() => window.location.assign(`/admin/vendors/${v.id}`)} className="px-3 py-1 text-sm rounded border border-slate-700">View</button>
                      <button disabled={busyId === v.id} onClick={() => toggleActive(v.id, !v.active)} className="px-3 py-1 text-sm rounded border border-slate-700">{v.active ? "Disable" : "Enable"}</button>
                      <button disabled={busyId === v.id} onClick={() => remove(v.id)} className="px-3 py-1 text-sm rounded bg-rose-500 text-white">Delete</button>
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
