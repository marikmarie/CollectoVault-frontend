/* src/features/vendor/VendorDashboard.tsx */
import { useEffect, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import vendorsService from "../../api/vendorsService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ROUTES from "../../constants/routes";

type ServiceSummary = {
  id: string;
  title: string;
  active: boolean;
  pricePoints?: number;
  priceCurrency?: number;
  createdAt?: string;
};

export default function VendorDashboard(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null);
  const [pointsRedeemed, setPointsRedeemed] = useState<number | null>(null);

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
          // fallback demo data
          if (mounted) {
            const demo: ServiceSummary[] = [
              { id: "s1", title: "Forest Mall: Spa Voucher", active: true, pricePoints: 1200, priceCurrency: 15000, createdAt: new Date().toISOString() },
              { id: "s2", title: "Restaurant: Dinner for Two", active: true, pricePoints: 800, priceCurrency: 10000, createdAt: new Date().toISOString() },
              { id: "s3", title: "Room discount 20%", active: false, pricePoints: 2000, priceCurrency: 25000, createdAt: new Date().toISOString() },
            ];
            setServices(demo);
          }
        }

        // demo KPIs (replace with real service calls later)
        setTotalOrders(124);
        setMonthlyRevenue(27300);
        setPointsRedeemed(45230);
      } catch (err: any) {
        console.warn("vendorsService.getMyServices failed:", err);
        if (mounted) setError("Failed to load services. Showing demo data.");

        if (mounted) {
          setServices([
            { id: "s1", title: "Demo Service A", active: true, pricePoints: 500, priceCurrency: 6, createdAt: new Date().toISOString() },
          ]);
          setTotalOrders(12);
          setMonthlyRevenue(240);
          setPointsRedeemed(1240);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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

          {/* New: Points & Tier direct buttons */}
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
          <p className="text-2xl font-bold">{monthlyRevenue !== null ? `UGX ${monthlyRevenue}` : "—"}</p>
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
                      {s.pricePoints ? `${s.pricePoints} pts` : ""}{s.pricePoints && s.priceCurrency ? " • " : ""}{s.priceCurrency ? `UGX${s.priceCurrency}` : ""}
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
              <Button variant="ghost" onClick={() => { /* open reports page */ navigate("/vendor/reports"); }}>View Reports</Button>
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
