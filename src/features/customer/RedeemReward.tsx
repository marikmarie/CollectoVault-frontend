/* src/features/customer/RedeemReward.tsx */
import React, { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useAuth } from "../auth/useAuth";
import vault from "../../api/vaultClient";

type Reward = {
  id?: string | number;
  title: string;
  description?: string;
  pointsPrice?: number | null;
  currencyPrice?: number | null;
  vendorName?: string;
};

export default function RedeemReward({ reward, onDone }: { reward: Reward; onDone?: (message?: string) => void }) {
  const { user, updateProfile } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedeemWithPoints = async () => {
    setProcessing(true);
    setError(null);
    try {
      // call vault redeem endpoint if available
      if (vault && (vault as any).post) {
        await vault.post(`/rewards/${reward.id}/redeem`, { userId: user?.id, method: "points" });
        // update local user points if demo
        updateProfile({ points: Math.max(0, (user?.points ?? 0) - (reward.pointsPrice ?? 0)) });
        onDone?.("Redeemed successfully. Enjoy your reward!");
        return;
      }

      // fallback demo
      await new Promise((r) => setTimeout(r, 900));
      updateProfile({ points: Math.max(0, (user?.points ?? 0) - (reward.pointsPrice ?? 0)) });
      onDone?.("Redeemed (demo) — enjoy!");
    } catch (err: any) {
      console.error("redeem failed", err);
      setError(err?.message ?? "Failed to redeem. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayWithCard = async () => {
    setProcessing(true);
    setError(null);
    try {
      // For currency purchases you'd call Collecto external payments then confirm with vault
      // We'll simulate demo flow
      await new Promise((r) => setTimeout(r, 900));
      onDone?.("Payment successful (demo). Your reward will be processed.");
    } catch (err: any) {
      setError(err?.message ?? "Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <Card>
        <div className="space-y-3">
          <div>
            <div className="text-lg font-semibold">{reward.title}</div>
            {reward.vendorName && <div className="text-sm text-slate-400">{reward.vendorName}</div>}
            {reward.description && <div className="text-sm text-slate-300 mt-2">{reward.description}</div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900/30 p-3 rounded">
              <div className="text-sm text-slate-400">Points price</div>
              <div className="text-2xl font-bold">{reward.pointsPrice ? `${reward.pointsPrice.toLocaleString()} pts` : "—"}</div>
            </div>
            <div className="bg-slate-900/30 p-3 rounded">
              <div className="text-sm text-slate-400">Currency</div>
              <div className="text-2xl font-bold">{reward.currencyPrice ? `$${reward.currencyPrice.toFixed(2)}` : "—"}</div>
            </div>
          </div>

          {error && <div className="text-sm text-rose-400">{error}</div>}

          <div className="flex items-center gap-3 justify-end">
            {reward.pointsPrice ? (
              <Button onClick={handleRedeemWithPoints} loading={processing} disabled={processing || (user?.points ?? 0) < (reward.pointsPrice ?? 0)}>
                Redeem with points
              </Button>
            ) : null}

            {reward.currencyPrice ? (
              <Button variant="secondary" onClick={handlePayWithCard} loading={processing} disabled={processing}>
                Pay ${reward.currencyPrice?.toFixed(2)}
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
