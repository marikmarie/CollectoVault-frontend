/* src/features/customer/RewardsCatalog.tsx */
import  { useEffect, useState, type JSX } from "react";
// import MainLayout from "../../components/layout/MainLayout";
import RewardCard from "../../components/common/RewardCard";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import RedeemReward from "./RedeemReward";
// import vault from "../../api/vaultClient";
import vendorsService from "../../api/vendorsService";
// import { useAuth } from "../auth/useAuth";
//import { useAuth } from "../../context/AuthContext";


type Reward = {
  id: string;
  title: string;
  description?: string;
  pointsPrice?: number | null;
  currencyPrice?: number | null;
  vendorName?: string;
  imageUrl?: string | null;
  tags?: string[];
  availability?: "available" | "soldout" | "coming_soon";
};

export default function RewardsCatalog(): JSX.Element {
  //const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReward, setActiveReward] = useState<Reward | null>(null);
  const [{/*redeeming*/}, setRedeeming] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if ((vendorsService as any)?.getAllRewards) {
          const res = await (vendorsService as any).getAllRewards();
          const data = res?.data ?? res;
          if (mounted) setRewards(data || []);
        } else {
          // fallback demo rewards
          if (!mounted) return;
          setRewards([
            { id: "r1", title: "Spa voucher", description: "2-hour session", pointsPrice: 120, currencyPrice: 15000, vendorName: "Forest Mall Spa", tags: ["popular"] },
            { id: "r2", title: "Dinner for two", description: "Set menu", pointsPrice: 900, currencyPrice: 25000, vendorName: "Lakeview", tags: ["new"] },
            { id: "r3", title: "Room discount 20%", description: "Weekday stays", pointsPrice: 2000, currencyPrice: 50000, vendorName: "Forest Park Resort", tags: ["bestseller"] },
          ]);
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onRedeemClick = (r: Reward) => {
    setActiveReward(r);
  };

  const onRedeemComplete = (message?: string) => {
    setActiveReward(null);
    setRedeeming(false);
    if (message) {
      setToast(message);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    // <MainLayout title="Rewards" subtitle="Browse rewards you can redeem with your points">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Available rewards</h3>
          <div className="text-sm text-slate-400">Showing curated rewards</div>
        </div>

        {loading ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 text-center"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((r) => (
              <RewardCard
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                pointsPrice={r.pointsPrice ?? null}
                currencyPrice={r.currencyPrice ?? null}
                vendorName={r.vendorName}
                imageUrl={r.imageUrl ?? null}
                tags={r.tags}
                onRedeem={() => onRedeemClick(r)}
              />
            ))}
          </div>
        )}

        <Modal open={Boolean(activeReward)} onClose={() => setActiveReward(null)} title={activeReward?.title ?? "Redeem"}>
          {activeReward && (
            <RedeemReward reward={activeReward} onDone={(msg) => onRedeemComplete(msg)} />
          )}
        </Modal>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="max-w-sm">
              <div className="bg-emerald-600 text-white rounded-md p-3 shadow">{toast}</div>
            </div>
          </div>
        )}
      </div>
    // </MainLayout>
  );
}
