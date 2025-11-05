/* src/features/vendor/VendorDashboard.tsx */
import { useEffect, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vendorService } from "../../api/vendorService";
import api from "../../api";
import { useSession } from "../../hooks/useSession";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ROUTES from "../../constants/routes";
import Spinner from "../../components/common/Spinner";

type ServiceSummary = {
  id: string;
  title: string;
  active: boolean;
  pricePoints?: number | null;
  priceCurrency?: number | null;
  createdAt?: string | null;
};

export default function VendorDashboard(): JSX.Element {
  const { user, loading: sessionLoading, isAuthenticated } = useSession() as any;
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null);
  const [pointsRedeemed, setPointsRedeemed] = useState<number | null>(null);

  // Redirect if not authenticated or not vendor role
  useEffect(() => {
    if (sessionLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // If authenticated but wrong role, redirect to their area
    if (user?.role && user.role !== "vendor") {
      if (user.role === "customer") navigate("/customer/dashboard");
      else if (user.role === "admin") navigate("/admin");
    }
  }, [sessionLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (sessionLoading) return;
      // only fetch when we have a vendor user
      if (!user || user.role !== "vendor") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Preferred: use vendorService if present
        if ((vendorService as any)?.getMyServices) {
          const res = await (vendorService as any).getMyServices();
          const data = res?.data ?? res;
          if (mounted) setServices((data || []) as ServiceSummary[]);
        } else {
          // fallback: call backend endpoint
          const { data } = await api.get(`/vendors/${user.id}/services`);
          if (mounted) setServices((data || []) as ServiceSummary[]);
        }

        // Try to fetch KPIs (optional)
        if ((vendorService as any)?.getMetrics) {
          const r = await (vendorService as any).getMetrics();
          const m = r?.data ?? r;
          if (mounted) {
            setTotalOrders(m?.totalOrders ?? null);
            setMonthlyRevenue(m?.monthlyRevenue ?? null);
            setPointsRedeemed(m?.pointsRedeemed ?? null);
          }
        } else {
          // fallback metrics endpoint
          try {
            const { data: metrics } = await api.get(`/vendors/${user.id}/metrics`);
            if (mounted) {
              setTotalOrders(metrics?.totalOrders ?? null);
              setMonthlyRevenue(metrics?.monthlyRevenue ?? null);
              setPointsRedeemed(metrics?.pointsRedeemed ?? null);
            }
          } catch {
            // keep defaults if metrics not available
            if (mounted) {
              setTotalOrders(null);
              setMonthlyRevenue(null);
              setPointsRedeemed(null);
            }
          }
        }
      } catch (err: any) {
        console.warn("Vendor dashboard load failed", err);
        if (mounted) {
          setError("Failed to load vendor data. Showing demo values.");
          // demo fallback
          setServices([
            { id: "s-demo", title: "Demo service", active: true, pricePoints: 500, priceCurrency: 15000, createdAt: new Date().toISOString() },
          ]);
          setTotalOrders(12);
          setMonthlyRevenue(24000);
          setPointsRedeemed(1240);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [user, sessionLoading]);

  // Show session loading state quickly
  if (sessionLoading) return <div className="p-6 text-center"><Spinner /></div>;
  if (!isAuthenticated) return <div className="p-6 text-center">Redirecting...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Vendor Dashboard</h2>
          <p className="text-sm text-slate-300">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""} — manage services, points & tiers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate(ROUTES.VENDOR.UPLOAD_SERVICE)} className="px-4 py-2">Upload Service</Button>
          <Link to={ROUTES.VENDOR.SERVICES} className="px-4 py-2 border border-slate-700 rounded-md text-sm hover:bg-slate-800">Manage Services</Link>

          <Button variant="secondary" onClick={() => navigate("/point-rules")} className="px-4 py-2">Manage Point Rules</Button>
          <Button variant="secondary" onClick={() => navigate("/tier-rules")} className="px-4 py-2">Manage Tier Rules</Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-slate-400">Total services</p>
          <p className="text-2xl font-bold">{services.length}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-400">Total orders</p>
          <p className="text-2xl font-bold">{totalOrders ?? "—"}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-400">Monthly revenue</p>
          <p className="text-2xl font-bold">{monthlyRevenue !== null ? `UGX ${monthlyRevenue.toLocaleString()}` : "—"}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-400">Points redeemed</p>
          <p className="text-2xl font-bold">{pointsRedeemed !== null ? pointsRedeemed.toLocaleString() : "—"}</p>
        </Card>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Recent services</h3>
          <Link to={ROUTES.VENDOR.SERVICES} className="text-sm text-slate-300 underline">View all</Link>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading services...</div>
          ) : error ? (
            <div className="p-4 text-sm text-rose-400">{error}</div>
          ) : services.length === 0 ? (
            <div className="p-6 text-center text-slate-400">You have no services yet. Upload one to get started.</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {services.slice(0, 5).map((s) => (
                <li key={s.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-slate-400">
                      {s.pricePoints ? `${s.pricePoints.toLocaleString()} pts` : ""}{s.pricePoints && s.priceCurrency ? " • " : ""}{s.priceCurrency ? `UGX ${Number(s.priceCurrency).toLocaleString()}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-2 py-1 rounded ${s.active ? "bg-emerald-600" : "bg-slate-700"} font-medium`}>{s.active ? "Active" : "Inactive"}</span>
                    <Link to={`${ROUTES.VENDOR.SERVICES}/${s.id}`} className="text-sm text-slate-300 hover:underline">Manage</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Quick actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-slate-400">Points & Rules</p>
            <p className="mt-2 text-sm">Manage how customers earn points and configure rule-based rewards.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="primary" onClick={() => navigate("/point-rules")}>Point Rules</Button>
              <Button variant="secondary" onClick={() => navigate("/tier-rules")}>Tier Rules</Button>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-slate-400">Reports</p>
            <p className="mt-2 text-sm">Download sales and redemptions reports for reconciliation.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={() => { /* wire export later */ }}>Export CSV</Button>
              <Button variant="ghost" onClick={() => navigate("/vendor/reports")}>View Reports</Button>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-slate-400">Settings</p>
            <p className="mt-2 text-sm">Update profile, payout, and integration settings.</p>
            <div className="mt-3 flex gap-2">
              <Link to="/vendor/profile" className="px-3 py-1.5 bg-white text-slate-900 rounded">Profile</Link>
              <Button variant="ghost" onClick={() => navigate("/vendor/payouts")}>Payouts</Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
