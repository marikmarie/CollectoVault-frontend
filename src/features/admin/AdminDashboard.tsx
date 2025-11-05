// src/pages/admin/AdminDashboard.tsx
import  { useEffect, useState, type JSX } from "react";
// import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
import vendorsService from "../../api/vendorService";
// import { useAuth } from "../../features/auth/useAuth";

type VendorSummary = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  approved?: boolean;
  createdAt?: string;
};

export default function AdminDashboard(): JSX.Element {
  // const { user } = useAuth();
  const [vendors, setVendors] = useState<VendorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // demo stats
  const [totalVendors, setTotalVendors] = useState<number | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<number | null>(null);
  const [totalServices, setTotalServices] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if ((vendorsService as any)?.getAllVendors) {
          const resp = await (vendorsService as any).getAllVendors();
          const data = resp?.data ?? resp;
          if (!mounted) return;
          setVendors(data || []);
        } else {
          // fallback demo vendors
          if (!mounted) return;
          const demo: VendorSummary[] = [
            { id: "v1", name: "Forest Mall", email: "contact@forestmall.com", phone: "+256700111222", approved: true, createdAt: new Date().toISOString() },
            { id: "v2", name: "Lakeview Restaurant", email: "hello@lakeview.com", phone: "+256700222333", approved: false, createdAt: new Date().toISOString() },
            { id: "v3", name: "Sunrise Spa", email: "spa@sunrise.com", phone: "+256700333444", approved: false, createdAt: new Date().toISOString() },
          ];
          setVendors(demo);
        }

        // demo stats
        setTotalVendors(42);
        setPendingApprovals(3);
        setTotalServices(128);
      } catch (err: any) {
        console.warn("getAllVendors failed", err);
        if (mounted) {
          setError("Unable to load vendors. Showing demo data.");
          setVendors([
            { id: "v-demo", name: "Demo Vendor", email: "demo@example.com", approved: true, createdAt: new Date().toISOString() },
          ]);
          setTotalVendors(1);
          setPendingApprovals(0);
          setTotalServices(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const approveVendor = async (id: string) => {
    try {
      if ((vendorsService as any)?.approveVendor) {
        await (vendorsService as any).approveVendor(id);
        setVendors((s) => s.map(v => v.id === id ? { ...v, approved: true } : v));
      } else {
        // demo fallback
        setVendors((s) => s.map(v => v.id === id ? { ...v, approved: true } : v));
      }
      setPendingApprovals((p) => (p !== null ? Math.max(0, p - 1) : null));
    } catch (err) {
      console.error("approve failed", err);
      setError("Failed to approve vendor. Try again.");
    }
  };

  return (
    // <MainLayout title="Admin dashboard" subtitle="Manage vendors, approvals and platform-wide insights">
    <div>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5">
          <p className="text-sm text-slate-400">Total vendors</p>
          <p className="text-2xl font-bold">{totalVendors ?? "—"}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5">
          <p className="text-sm text-slate-400">Pending approvals</p>
          <p className="text-2xl font-bold">{pendingApprovals ?? "—"}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5">
          <p className="text-sm text-slate-400">Total services</p>
          <p className="text-2xl font-bold">{totalServices ?? "—"}</p>
        </div>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Recent vendor signups</h3>
          <div className="flex items-center gap-3">
            <Link to="/admin/vendors" className="text-sm text-slate-300 underline">Manage vendors</Link>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-slate-400">Loading vendors...</div>
          ) : error ? (
            <div className="p-4 text-sm text-rose-400">{error}</div>
          ) : vendors.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No vendors yet.</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {vendors.slice(0, 6).map(v => (
                <li key={v.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-slate-400">{v.email ?? "—"} • {v.phone ?? "—"}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!v.approved ? (
                      <button onClick={() => approveVendor(v.id)} className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-sm">Approve</button>
                    ) : (
                      <span className="px-2 py-1 rounded bg-slate-700 text-sm">Approved</span>
                    )}

                    <Link to={`/admin/vendors/${v.id}`} className="text-sm text-slate-300 hover:underline">View</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Quick actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">Create vendor</p>
            <p className="mt-2 text-sm">Register a vendor manually for special partners.</p>
            <div className="mt-3">
              <Link to="/admin/vendors/new" className="px-3 py-1.5 bg-white text-slate-900 rounded">Add vendor</Link>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">Platform settings</p>
            <p className="mt-2 text-sm">Configure global point rates and integrations.</p>
            <div className="mt-3">
              <Link to="/admin/settings" className="px-3 py-1.5 bg-white text-slate-900 rounded">Settings</Link>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400">Export reports</p>
            <p className="mt-2 text-sm">Export vendor and redemption reports as CSV.</p>
            <div className="mt-3">
              <button className="px-3 py-1.5 bg-white text-slate-900 rounded">Export</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
