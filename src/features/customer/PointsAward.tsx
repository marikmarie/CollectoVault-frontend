/* src/features/customer/PointsAward.tsx */
import  { useState , type JSX } from "react";
//import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
// import { useAuth } from "../auth/useAuth";
import { useAuth } from "../../context/AuthContext";

import collectoPayments from "../../api/collectoPayments";
//import vault from "../../api/vaultClient";
import Spinner from "../../components/common/Spinner";
//import { div } from "framer-motion/client";

export default function PointsAward(): JSX.Element {
  const { user, updateProfile } = useAuth();
  const [amountUsd, setAmountUsd] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // First, create a payment intent via Collecto or create an order on vault API then call collecto
      if ((collectoPayments as any)?.initiatePayment) {
        const resp = await (collectoPayments as any).initiatePayment({ amount: amountUsd, currency: "USD", description: "Buy Collecto points" });
        const data = resp?.data ?? resp;
        // If collecto returns a redirect url
        if (data?.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      }

      // Fallback demo: simulate success and credit points locally
      await new Promise((r) => setTimeout(r, 900));
      const pointsBought = Math.round(amountUsd * 100); // demo rate: $1 -> 100 pts
      // Update local user (demo)
      updateProfile({ points: (user?.points ?? 0) + pointsBought });
      setMessage(`Success! Credited ${pointsBought.toLocaleString()} points.`);
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to process payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <MainLayout title="Buy points" subtitle="Purchase Collecto points quickly and securely">
      <div>
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-slate-300">Amount (USD)</label>
              <input
                type="number"
                min={1}
                value={amountUsd}
                onChange={(e) => setAmountUsd(Number(e.target.value))}
                className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700"
              />
            </div>

            <div>
              <p className="text-sm text-slate-300">Rate: 1 USD = 100 points (demo). Final points credited after successful payment.</p>
            </div>

            {message && <div className="text-sm text-emerald-400">{message}</div>}

            <div className="flex items-center gap-3 justify-end">
              <Button variant="secondary" onClick={() => setAmountUsd(10)}>Quick $10</Button>
              <Button onClick={handleBuy} loading={loading}>
                {loading ? <span className="flex items-center gap-2"><Spinner size={1.2} label="Processing..." /></span> : "Proceed to pay"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
