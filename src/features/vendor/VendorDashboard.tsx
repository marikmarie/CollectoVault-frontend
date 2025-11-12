/* src/features/vendor/VendorDashboard.tsx */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import api from "../../api";

type PointPackage = {
  id: number;
  label?: string;
  points: number;
  price: number;
  currency?: string;
  created_at?: string | null;
};

export default function VendorDashboard() {
  const { user, loaded } = useSession() as any;
  const navigate = useNavigate();

  const [packages, setPackages] = useState<PointPackage[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | null>(null);
  const [pointsRedeemed, setPointsRedeemed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // redirect / role guard
  useEffect(() => {
    if (!loaded) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (user?.role !== "vendor" && user?.role !== "business") {
      if (user?.role === "customer") navigate("/customer/dashboard");
      else if (user?.role === "admin") navigate("/admin");
    }
  }, [loaded, user, navigate]);

  // load packages + optional metrics
  useEffect(() => {
    if (!loaded || !user) return;
    if (user.role !== "vendor" && user.role !== "business") return;

    const load = async () => {
      setLoading(true);
      try {
        // packages for this business
        const resp = await api.get(`/api/point-packages?businessId=${user.id}`);
        setPackages(Array.isArray(resp.data) ? resp.data : []);

        // optional metrics endpoint (if available)
        try {
          const metricsRes = await api.get(`/api/vendor/${user.id}/metrics`);
          const m = metricsRes.data ?? {};
          setTotalOrders(m.totalOrders ?? 0);
          setMonthlyRevenue(m.monthlyRevenue ?? 0);
          setPointsRedeemed(m.pointsRedeemed ?? 0);
        } catch {
          // metrics are optional — silence errors
          setTotalOrders(0);
          setMonthlyRevenue(0);
          setPointsRedeemed(0);
        }
      } catch (err) {
        console.error("[VendorDashboard] load error:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [loaded, user]);

  if (!loaded || !user) return <div className="p-6 text-center"><Spinner /></div>;

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <p className="text-sm text-slate-400">
            Manage point packages, loyalty rules and your customers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate("/vendor/create-package")}>Create Package</Button>
          <Button variant="secondary" onClick={() => navigate("/point-rules")}>Point Rules</Button>
          <Button variant="secondary" onClick={() => navigate("/tier-rules")}>Tier Rules</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-slate-400">Total Packages</p>
          <p className="text-2xl font-bold">{packages.length}</p>
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

      {/* Recent Packages */}
      <section>
        <div className="flex justify-between mb-3">
          <h3 className="text-lg font-semibold">Point Packages</h3>
          <Link to="/vendor/packages" className="text-sm underline text-slate-300">View All</Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center"><Spinner /></div>
          ) : packages.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              You have no point packages yet. Create one to let customers buy points.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {packages.slice(0, 6).map((p) => (
                <li key={p.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.label ?? `${p.points} pts`}</div>
                    <div className="text-sm text-slate-400">
                      {p.points.toLocaleString()} pts • {p.currency ?? "UGX"} {Number(p.price).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to={`/vendor/packages/${p.id}`} className="text-sm underline">Manage</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
