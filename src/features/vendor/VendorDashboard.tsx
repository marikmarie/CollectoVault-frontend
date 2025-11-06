/* src/features/vendor/VendorDashboard.tsx */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vendorService } from "../../api/vendorService";
import { useSession } from "../../hooks/useSession";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ROUTES from "../../constants/routes";
import Spinner from "../../components/common/Spinner";

type ServiceSummary = {
  id: string | number;
  title: string;
  active: boolean;
  price_points?: number | null;
  price_currency?: number | null;
  created_at?: string | null;
};

export default function VendorDashboard() {
  const { user, loading: sessionLoading, isAuthenticated } = useSession() as any;
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null);
  const [pointsRedeemed, setPointsRedeemed] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  // 🔐 Redirect if not vendor
  useEffect(() => {
    if (sessionLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "vendor") {
      if (user?.role === "customer") navigate("/customer/dashboard");
      else if (user?.role === "admin") navigate("/admin");
    }
  }, [user, isAuthenticated, sessionLoading, navigate]);

  // 📡 Load dashboard data
  useEffect(() => {
    if (!user?.id || user.role !== "vendor") return;

    const load = async () => {
      try {
        setLoading(true);

        // Get services
        const serviceRes = await vendorService.getMyServices();
        setServices(serviceRes.data || []);

        // Get metrics (optional endpoint)
        try {
          const metricsRes = await vendorService.getMetrics(user.id);
          setTotalOrders(metricsRes.data?.totalOrders ?? 0);
          setMonthlyRevenue(metricsRes.data?.monthlyRevenue ?? 0);
          setPointsRedeemed(metricsRes.data?.pointsRedeemed ?? 0);
        } catch {
          setTotalOrders(0);
          setMonthlyRevenue(0);
          setPointsRedeemed(0);
        }

      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (sessionLoading || !user) return <div className="p-6 text-center"><Spinner /></div>;

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <p className="text-sm text-slate-400">
            Manage your services, customers & loyalty system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate(ROUTES.VENDOR.UPLOAD_SERVICE)}>Upload Service</Button>
          <Link to={ROUTES.VENDOR.SERVICES} className="border px-4 py-2 rounded-md text-sm">
            Manage Services
          </Link>
          <Button variant="secondary" onClick={() => navigate("/point-rules")}>Point Rules</Button>
          <Button variant="secondary" onClick={() => navigate("/tier-rules")}>Tier Rules</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-slate-400">Total Services</p>
          <p className="text-2xl font-bold">{services.length}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-400">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders ?? "—"}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-400">Monthly Revenue</p>
          <p className="text-2xl font-bold">
            {monthlyRevenue !== null ? `UGX ${monthlyRevenue.toLocaleString()}` : "—"}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-400">Points Redeemed</p>
          <p className="text-2xl font-bold">
            {pointsRedeemed !== null ? pointsRedeemed.toLocaleString() : "—"}
          </p>
        </Card>
      </div>

      {/* Recent Services */}
      <section>
        <div className="flex justify-between mb-3">
          <h3 className="text-lg font-semibold">Recent Services</h3>
          <Link to={ROUTES.VENDOR.SERVICES} className="text-sm underline text-slate-300">View All</Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center"><Spinner /></div>
          ) : services.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              You have no services yet. Upload one to get started.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {services.slice(0, 5).map((s) => (
                <li key={s.id} className="p-4 flex justify-between">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-slate-400">
                      {s.price_points ? `${s.price_points} pts` : ""}{" "}
                      {s.price_currency ? `• UGX ${Number(s.price_currency).toLocaleString()}` : ""}
                    </div>
                  </div>
                  <Link to={`${ROUTES.VENDOR.SERVICES}/${s.id}`} className="text-sm underline">
                    Manage
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
