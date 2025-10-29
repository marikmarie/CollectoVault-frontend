/* src/features/customer/Checkout.tsx */
import  { useMemo, useState , type JSX } from "react";
// import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
// import { useAuth } from "../auth/useAuth";
import { useAuth } from "../../context/AuthContext";
import collectoPayments from "../../api/collectoPayments";
import vault from "../../api/vaultClient";

type CartItem = {
  id: string;
  title: string;
  qty?: number;
  pricePoints?: number | null;
  priceCurrency?: number | null;
  vendorId?: string;
};

const demoCart: CartItem[] = [
  { id: "r1", title: "Spa voucher", qty: 1, pricePoints: 1200, priceCurrency: 150000, vendorId: "v1" },
  { id: "r2", title: "Dinner for two", qty: 1, pricePoints: 800, priceCurrency: 100000, vendorId: "v2" },
];

export default function Checkout(): JSX.Element {
  const { user, updateProfile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(demoCart);
  const [payWithPoints, setPayWithPoints] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const totals = useMemo(() => {
    const points = cart.reduce((s, it) => s + ((it.pricePoints ?? 0) * (it.qty ?? 1)), 0);
    const currency = cart.reduce((s, it) => s + ((it.priceCurrency ?? 0) * (it.qty ?? 1)), 0);
    return { points, currency };
  }, [cart]);

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setMessage(null);
    try {
      if (payWithPoints) {
        // To do: vault API to place order and deduct points
        if (vault && (vault as any).post) {
          await vault.post("/orders", { items: cart, payWith: "points" });
          // demo: deduct points locally
          updateProfile({ points: Math.max(0, (user?.points ?? 0) - totals.points) });
          setMessage("Order placed. Points deducted from your balance.");
          setCart([]);
          return;
        }

        // fallback demo:
        await new Promise((r) => setTimeout(r, 800));
        updateProfile({ points: Math.max(0, (user?.points ?? 0) - totals.points) });
        setMessage("Order placed (demo). Points deducted.");
        setCart([]);
      } else {
        // pay with currency -> collectoPayments
        if ((collectoPayments as any)?.initiatePayment) {
          const resp = await (collectoPayments as any).initiatePayment({ amount: totals.currency, currency: "USD", description: "Purchase from CollectoVault" });
          const data = resp?.data ?? resp;
          if (data?.redirectUrl) {
            window.location.href = data.redirectUrl;
            return;
          }
        }

        // fallback: simulate payment and credit order on vault
        await new Promise((r) => setTimeout(r, 900));
        setMessage("Payment successful (demo). Order placed.");
        setCart([]);
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to place order. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    //<MainLayout title="Checkout" subtitle="Confirm your order and pay">
      <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            {cart.length === 0 ? (
              <div className="text-slate-400">Your cart is empty.</div>
            ) : (
              <div className="space-y-3">
                {cart.map((it) => (
                  <div key={it.id} className="flex items-center justify-between bg-slate-900/30 p-3 rounded">
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-slate-400">{it.qty} × {it.pricePoints ? `${it.pricePoints.toLocaleString()} pts` : `UGX ${it.priceCurrency?.toFixed(1)}`}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{it.pricePoints ? `${(it.pricePoints * (it.qty ?? 1)).toLocaleString()} pts` : `UGX ${((it.priceCurrency ?? 0) * (it.qty ?? 1)).toFixed(1)}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <aside>
          <Card>
            <h4 className="text-sm text-slate-400">Summary</h4>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">Points total</div>
                <div className="font-semibold">{totals.points.toLocaleString()} pts</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-slate-300">Currency total</div>
                <div className="font-semibold">UGX {totals.currency.toFixed(2)}</div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="pay" checked={payWithPoints} onChange={() => setPayWithPoints(true)} />
                  <span className="text-sm text-slate-300">Pay with points</span>
                </label>
                <label className="inline-flex items-center gap-2 ml-4">
                  <input type="radio" name="pay" checked={!payWithPoints} onChange={() => setPayWithPoints(false)} />
                  <span className="text-sm text-slate-300">Pay with card</span>
                </label>
              </div>

              <div className="mt-4">
                <Button onClick={handlePlaceOrder} loading={processing} disabled={cart.length === 0}>
                  {processing ? "Processing..." : (payWithPoints ? `Redeem ${totals.points.toLocaleString()} pts` : `Pay UGX ${totals.currency.toFixed(1)}`)}
                </Button>
              </div>

              {message && <div className="mt-3 text-sm text-emerald-400">{message}</div>}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
