// src/features/customer/dashboard/CustomerDashboard.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "/../../api"; // adjust path if needed
import PointsCard from "./PointsCard";
import TierProgress from "./TierProgress";
import RewardsList from "./RewardsList";
import BuyPointsModal from "./BuyPointsModal";
import CreateUsernameModal from "./CreateUsernameModal";
import Toast from "../../components/common/Toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Me = {
  id: number;
  name?: string;
  phone?: string;
  username?: string | null;
  type?: "business" | "client" | "staff";
  collecto_id?: string | null;
};

export default function CustomerDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [tiers, setTiers] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // load initial data
    async function load() {
      setLoading(true);
      try {
        const [meResp, balResp, tiersResp, rewardsResp] = await Promise.all([
          api.get("/api/me"),
          api.get("/api/points/balance"),
          api.get("/api/tiers"),
          api.get("/api/rewards"),
        ]);
        setMe(meResp.data);
        setBalance(balResp.data?.totalPoints ?? 0);
        setTiers(tiersResp.data ?? []);
        setRewards(rewardsResp.data ?? []);
      } catch (err: any) {
        // If unauthorized, redirect to login
        if (err?.status === 401 || err?.statusCode === 401) {
          navigate("/auth/login");
          return;
        }
        console.error("Dashboard load error", err);
        setToast({ message: err?.message ?? "Unable to load dashboard", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  const refreshBalance = async () => {
    try {
      const resp = await api.get("/api/points/balance");
      setBalance(resp.data?.totalPoints ?? 0);
    } catch (err: any) {
      console.error("refresh balance", err);
    }
  };

  const handleRedeem = async (rewardId: number) => {
    try {
      const resp = await api.post("/api/rewards/redeem", { rewardId });
      if (resp.data?.ok) {
        setToast({ message: "Reward redeemed — enjoy!", type: "success" });
        await refreshBalance();
      } else {
        setToast({ message: resp.data?.message ?? "Redeem failed", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err?.message ?? "Redeem failed", type: "error" });
    }
  };

  const openBuy = () => setShowBuyModal(true);
  const openUsernameModal = () => setShowUsernameModal(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 p-4 sm:p-8 text-white">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <Coins className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {me ? (me.name ?? "Your account") : "Customer Dashboard"}
              </h1>
              <p className="text-sm text-slate-300 mt-1">Welcome back — your loyalty details below</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!me?.username && (
              <Button variant="ghost" onClick={openUsernameModal}>
                Create username
              </Button>
            )}
            <Button onClick={openBuy}>Buy points</Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 space-y-6">
          <PointsCard balance={balance} onTopUp={openBuy} />
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Account</div>
                <div className="text-lg font-medium">{me?.username ?? me?.phone ?? "No username"}</div>
              </div>
              <div className="text-sm text-slate-400">
                {me?.type ? me.type.toUpperCase() : "CLIENT"}
              </div>
            </div>
          </Card>
        </section>

        <section className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tier progress</h2>
            <TierProgress tiers={tiers} currentPoints={balance} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Available rewards</h2>
              <div className="text-sm text-slate-400">{rewards.length} items</div>
            </div>
            <RewardsList rewards={rewards} onRedeem={handleRedeem} currentPoints={balance} />
          </Card>
        </section>
      </main>

      <BuyPointsModal open={showBuyModal} onClose={() => setShowBuyModal(false)} onBought={async () => { setShowBuyModal(false); await refreshBalance(); setToast({ message: "Purchase complete", type: "success" }); }} />

      <CreateUsernameModal open={showUsernameModal} onClose={() => setShowUsernameModal(false)} onCreated={(username) => { setShowUsernameModal(false); setMe((m) => m ? { ...m, username } : m); setToast({ message: "Username created", type: "success" }); }} />

      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
