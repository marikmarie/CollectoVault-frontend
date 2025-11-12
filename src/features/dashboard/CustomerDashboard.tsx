import type { JSX } from "react";
import { useEffect, useState } from "react";
import useSession from "../../hooks/useSession";
import api from "../../api";
import NavBar from "../../components/layout/Navbar";
import PointsCard from "./PointsCard";
import TierProgress from "./TierProgress";
import RewardsList from "./RewardsList";
import BuyPointsModal from "./BuyPointsModal";
import CreateUsernameModal from "./CreateUsernameModal";

export default function CustomerDashboard(): JSX.Element {
  const { user, loaded, logout, reload, setUser } = useSession();

  const [loading, setLoading] = useState(true);

  const [points, setPoints] = useState<number | null>(null);
  const [tier, setTier] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [buyOpen, setBuyOpen] = useState(false);
  const [usernameModal, setUsernameModal] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      
      const meResp = await api.get("/api/customer/me");
      setUser(meResp.data);
      setPoints(meResp.data?.points ?? null);
      try {
        const tierResp = await api.get("/api/customer/tier");
        setTier(tierResp.data?.currentTier ?? null);
        setTiers(tierResp.data?.tiers ?? []);
      } catch {
        setTier(null);
        setTiers([]);
      }

      try {
        const rewardResp = await api.get("/api/customer/rewards");
        setRewards(rewardResp.data ?? []);
      } catch {
        setRewards([]);
      }

      try {
        const invResp = await api.get("/api/customer/invoices");
        setInvoices(invResp.data ?? []);
      } catch {
        setInvoices([]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loaded) loadData();
  }, [loaded]);

  if (!loaded) return <div className="text-white p-6">Loading session...</div>;
  if (!user) return <div className="text-white p-6">Not logged in</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Balance Top Section */}
        <PointsCard
          points={points ?? 0}
          onBuy={() => setBuyOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Recent Activity */}
            <section className="bg-slate-800/40 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>

              {loading ? (
                <div className="text-sm text-slate-400">Loading...</div>
              ) : invoices.length === 0 ? (
                <div className="text-sm text-slate-500">No activity yet</div>
              ) : (
                <ul className="space-y-3">
                  {invoices.map((inv: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between bg-slate-800/30 p-4 rounded-lg">
                      <div>
                        <div className="text-sm text-slate-300">{inv.description || inv.ref || "Transaction"}</div>
                        <div className="text-xs text-slate-500">
                          {inv.date || inv.created_at ? new Date(inv.date ?? inv.created_at).toLocaleString() : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        {inv.points != null && (
                          <div className="text-sm font-semibold">{Number(inv.points).toLocaleString()} pts</div>
                        )}
                        {inv.amount != null && (
                          <div className="text-xs text-slate-400">UGX {Number(inv.amount).toLocaleString()}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Tier */}
            <section className="bg-slate-800/40 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Tier</h3>
              {loading ? (
                <div className="text-sm text-slate-400">Loading...</div>
              ) : !tier || tiers.length === 0 ? (
                <div className="text-sm text-slate-500">No tier information available</div>
              ) : (
                <TierProgress currentPoints={points ?? 0} tiers={tiers} />
              )}
            </section>

            {/* Rewards */}
            <section className="bg-slate-800/40 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Available Rewards</h3>
              <RewardsList rewards={rewards} points={points ?? 0} onRedeemed={loadData} />
            </section>

            {/* Account */}
            <section className="bg-slate-800/40 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Account</h3>

              {!user.username && (
                <button
                  onClick={() => setUsernameModal(true)}
                  className="w-full px-4 py-2 rounded bg-emerald-500 text-white font-medium mb-2"
                >
                  Create username
                </button>
              )}

              <button
                onClick={logout}
                className="w-full px-4 py-2 rounded bg-slate-700 text-white font-medium"
              >
                Logout
              </button>
            </section>

          </div>
        </div>
      </main>

      {/* Modals */}
      <BuyPointsModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onSuccess={loadData}
      />

      <CreateUsernameModal
        open={usernameModal}
        onClose={() => setUsernameModal(false)}
        onCreated={reload}
      />

    </div>
  );
}
