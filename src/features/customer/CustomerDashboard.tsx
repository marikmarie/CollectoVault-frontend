/* src/features/customer/CustomerDashboard.tsx */
import  { useEffect, useState , type JSX} from "react";
//import MainLayout from "../../components/layout/MainLayout";
import TierProgress from "../../components/common/TierProgress";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import RewardCard from "../../components/common/RewardCard";
import Spinner from "../../components/common/Spinner";
//import { useAuth } from "../auth/useAuth";
import { useAuth } from "../../context/AuthContext";

import vendorsService from "../../api/vendorsService";
import vault from "../../api/vaultClient";

type Reward = {
  id: string;
  title: string;
  description?: string;
  pointsPrice?: number | null;
  currencyPrice?: number | null;
  vendorName?: string;
  imageUrl?: string | null;
};

export default function CustomerDashboard(): JSX.Element {
  const { user } = useAuth();
  const [points, setPoints] = useState<number>(user?.points ?? 0);
  const [tier, setTier] = useState<string>("Silver");
  const [nextTierPoints, setNextTierPoints] = useState<number>(2000);
  const [topRewards, setTopRewards] = useState<Reward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingRewards(true);
      try {
        // try vault API for quick recommendations / top rewards
        if ((vendorsService as any)?.getTopRewards) {
          const res = await (vendorsService as any).getTopRewards();
          const data = res?.data ?? res;
          if (mounted) setTopRewards(data || []);
        } else if ((vendorsService as any)?.getAllServices) {
          const res = await (vendorsService as any).getAllServices();
          const data = res?.data ?? res;
          if (mounted) setTopRewards((data || []).slice(0, 3));
        } else {
          // fallback demo
          if (!mounted) return;
          const demo: Reward[] = [
            { id: "r1", title: "2-Hour Spa Voucher", description: "Relaxing treatment", pointsPrice: 1200, currencyPrice: 15, vendorName: "Forest Mall Spa", imageUrl: null },
            { id: "r2", title: "Dinner for two", description: "Includes dessert", pointsPrice: 800, currencyPrice: 10, vendorName: "Lakeview Restaurant", imageUrl: null },
            { id: "r3", title: "Room Discount 20%", description: "Valid weekday stays", pointsPrice: 2000, currencyPrice: 25, vendorName: "Forest Park Resort", imageUrl: null },
          ];
          setTopRewards(demo);
        }

        
        if (user?.id && vault) {
          try {
            const resp = await vault.get(`/customers/${user.id}/points`);
            const data = resp?.data ?? resp;
            if (mounted && data?.balance !== undefined) setPoints(data.balance);
          } catch {
            // ignore and keep demo
          }
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoadingRewards(false);
      }
    })();

    return () => { mounted = false; };
  }, [user]);

  return (
    // <MainLayout title="Your dashboard" subtitle="See your points, tier progress and recommended rewards">
      <div>      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-400">Points balance</div>
                <div className="text-3xl font-extrabold">{points.toLocaleString()} pts</div>
                <div className="text-sm text-slate-300 mt-1">Member: {user?.firstName ?? user?.email ?? "Guest"}</div>
              </div>

              <div className="flex flex-col gap-3 items-end">
                <Button variant="secondary" onClick={() => window.location.assign("/customer/rewards")}>Redeem rewards</Button>
                <Button onClick={() => window.location.assign("/buy-points")}>Buy points</Button>
              </div>
            </div>
          </Card>

          <Card className="">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Tier progress</h3>
                  <p className="text-sm text-slate-400">Keep earning to reach the next tier.</p>
                </div>
                <div className="text-sm text-slate-300">Current: <strong>{tier}</strong></div>
              </div>

              <TierProgress currentPoints={points} currentTier={tier} nextTier="Gold" nextTierPoints={nextTierPoints} />
            </div>
          </Card>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent activity</h3>
              <a className="text-sm text-slate-300 underline" href="/customer/transactions">View all</a>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
              {/* simple activity items — try fetch from vault */}
              <ul className="divide-y divide-slate-800">
                <li className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm">Earned points</div>
                    <div className="text-xs text-slate-400">Subscription bonus</div>
                  </div>
                  <div className="text-green-400 font-semibold">+200 pts</div>
                </li>
                <li className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm">Redeemed</div>
                    <div className="text-xs text-slate-400">Spa voucher</div>
                  </div>
                  <div className="text-rose-400 font-semibold">-1,200 pts</div>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Recommended for you</h3>
            {loadingRewards ? (
              <Card><div className="p-6 text-center"><Spinner /></div></Card>
            ) : (
              <div className="grid gap-4">
                {topRewards.map((r) => (
                  <RewardCard
                    key={r.id}
                    id={r.id}
                    title={r.title}
                    description={r.description}
                    pointsPrice={r.pointsPrice ?? null}
                    currencyPrice={r.currencyPrice ?? null}
                    vendorName={r.vendorName}
                    imageUrl={r.imageUrl ?? null}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4">
            <h4 className="text-sm text-slate-400">Tips</h4>
            <ul className="mt-2 text-sm text-slate-300 space-y-2">
              <li>• Buy points during promotions for bonus credits.</li>
              <li>• Redeem points for partner services for bigger savings.</li>
            </ul>
          </div>
        </aside>
      </div>
      </div>
    // </MainLayout>
  );
}
