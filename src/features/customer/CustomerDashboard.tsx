// src/features/customer/CustomerDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TierProgress from "../../components/common/TierProgress";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import RewardCard from "../../components/common/RewardCard";
import Spinner from "../../components/common/Spinner";
import api from "../../api";
import { useSession } from "../../hooks/useSession";

type Reward = {
  id: string;
  title: string;
  description?: string;
  pointsPrice?: number | null;
  currencyPrice?: number | null;
  vendorName?: string | null;
  imageUrl?: string | null;
};

export default function CustomerDashboard() {
  const { user, loading: sessionLoading, isAuthenticated } = useSession() as any;
  const navigate = useNavigate();

  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState("Silver");
  const [nextTierPoints] = useState(2000);
  const [topRewards, setTopRewards] = useState<Reward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);

  // Only run redirects after session finished loading
  useEffect(() => {
    if (sessionLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // If authenticated but wrong role, redirect to their area
    if (user?.role && user.role !== "customer") {
      if (user.role === "vendor") navigate("/vendor/dashboard");
      else if (user.role === "admin") navigate("/admin");
    }
  }, [sessionLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // only fetch when we have a customer user
      if (sessionLoading) return;
      if (!user || user.role !== "customer") {
        setLoading(false);
        setLoadingRewards(false);
        return;
      }

      setLoading(true);
      setError(null);
      setLoadingRewards(true);

      try {
        const { data: profile } = await api.get(`/customers/${user.id}`);
        if (mounted) {
          setPoints(profile.points ?? 0);
          setTier(profile.tier ?? "Silver");
        }

        const { data: rewards } = await api.get<Reward[]>(`/rewards/top`);
        if (mounted) setTopRewards(rewards || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load customer data.");
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingRewards(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user, sessionLoading]);

  if (sessionLoading) return <Spinner />;
  if (!user) return <div className="p-6 text-center">Please log in.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">Points balance</div>
              <div className="text-3xl font-extrabold">{points.toLocaleString()} pts</div>
              <div className="text-sm text-slate-300 mt-1">{user.firstName ?? user.email}</div>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <Button variant="secondary" onClick={() => window.location.assign("/customer/rewards")}>Redeem rewards</Button>
              <Button onClick={() => window.location.assign("/buy-points")}>Buy points</Button>
            </div>
          </div>
        </Card>

        <Card>
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
      </div>

      <aside className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Recommended for you</h3>
          {loadingRewards ? (
            <Card><div className="p-6 text-center"><Spinner /></div></Card>
          ) : (
            <div className="grid gap-4">
              {topRewards.map((r) => (
                <RewardCard key={r.id} {...r} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
