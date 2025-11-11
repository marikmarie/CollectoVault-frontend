import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { useVaultSession } from "../../hooks/useVaultSession";
import api from "../../api";

import PointsCard from "./PointsCard";
import TierProgress from "./TierProgress";
import RewardsList from "./RewardsList";
import BuyPointsModal from "./BuyPointsModal";
import CreateUsernameModal from "./CreateUsernameModal";

export default function CustomerDashboard() {
  const { token } = useVaultSession();
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [hasUsername, setHasUsername] = useState(false);

  const [openBuy, setOpenBuy] = useState(false);
  const [openUsername, setOpenUsername] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    try {
      const resp = await api.get("/vault/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPoints(resp.data.points);
      setTier(resp.data.tier);
      setRewards(resp.data.rewards);
      setInvoices(resp.data.invoices);
      setHasUsername(resp.data.hasUsername);
    } catch (err) {
      console.error("Dashboard load failed", err);
    }
    setLoading(false);
  }

  useEffect(() => { if (token) loadDashboard(); }, [token]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <VaultNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        <PointsCard points={points} onBuy={() => setOpenBuy(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Recent invoices */}
            <div className="p-4 bg-slate-800/40 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              {loading && <div className="text-sm text-slate-400">Loading...</div>}
              {!loading && invoices.length === 0 && (
                <div className="text-sm text-slate-400">No activity yet</div>
              )}
              {!loading && invoices.length > 0 && (
                <ul className="space-y-2">
                  {invoices.map(inv => (
                    <li key={inv.id} className="flex justify-between text-sm bg-slate-800/20 p-3 rounded">
                      <div>{inv.description}</div>
                      <div className="text-right text-emerald-300">{inv.points} pts</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <aside className="space-y-6">
            <TierProgress currentPoints={points} tier={tier} />

            <div className="bg-slate-800/40 p-4 rounded-lg">
              <h3 className="text-lg mb-2 font-semibold">Available Rewards</h3>
              <RewardsList rewards={rewards} />
            </div>

            {!hasUsername && (
              <button
                onClick={() => setOpenUsername(true)}
                className="w-full px-4 py-3 rounded bg-emerald-600 hover:bg-emerald-700 font-semibold"
              >
                Create Username
              </button>
            )}
          </aside>
        </div>
      </main>

      <BuyPointsModal open={openBuy} onClose={() => setOpenBuy(false)} onSuccess={loadDashboard} />
      <CreateUsernameModal open={openUsername} onClose={() => setOpenUsername(false)} onCreated={loadDashboard} />
    </div>
  );
}
