/* src/features/customer/Checkout.tsx */
import { useMemo, useState, type JSX } from "react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Spinner from "../../../components/common/Spinner";
import api from "../../../api";
import useSession from "../../../hooks/useSession";

type CartItem = {
  id: string;
  title: string;
  qty?: number;
  pricePoints?: number | null;
  priceCurrency?: number | null; // UGX
  vendorId?: string;
};

const demoCart: CartItem[] = [
  { id: "r1", title: "Spa voucher", qty: 1, pricePoints: 1200, priceCurrency: 150_000, vendorId: "v1" },
  { id: "r2", title: "Dinner for two", qty: 1, pricePoints: 800, priceCurrency: 100_000, vendorId: "v2" },
];

export default function Checkout(): JSX.Element {
  const { user, setUser } = (useSession() as any) ?? { user: null, setUser: undefined };
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
    if (!user) {
      setMessage("Please log in to place an order.");
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      const payload = {
        items: cart.map((it) => ({
          id: it.id,
          qty: it.qty ?? 1,
          pricePoints: it.pricePoints ?? null,
          priceCurrency: it.priceCurrency ?? null,
          vendorId: it.vendorId ?? null,
          title: it.title,
        })),
        payWith: payWithPoints ? "points" : "currency",
        currency: "UGX",
      };

      // Backend handles points deduction or payment creation
      const { data } = await api.post("/orders", payload);

      // If backend returned a redirect for external payment, follow it
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      // On success (points deducted or payment processed)
      // Refresh user profile (GET /api/customers/:id) and setUser so UI updates
      try {
        const { data: profile } = await api.get(`/customers/${user.id}`);
        if (setUser) setUser(profile);
      } catch (err) {
        // non-fatal — continue
        console.warn("Failed to refresh user profile after order", err);
      }

      // Clear cart and show message
      setCart([]);
      setMessage(data?.message ?? "Order placed successfully.");
    } catch (err: any) {
      // Try to show API error message shape
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to place order. Try again.";
      setMessage(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
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
                      <div className="text-xs text-slate-400">
                        {it.qty} × {it.pricePoints ? `${it.pricePoints.toLocaleString()} pts` : `UGX ${Number(it.priceCurrency ?? 0).toLocaleString()}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {it.pricePoints ? `${(it.pricePoints * (it.qty ?? 1)).toLocaleString()} pts` : `UGX ${((it.priceCurrency ?? 0) * (it.qty ?? 1)).toLocaleString()}`}
                      </div>
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
                <div className="font-semibold">UGX {totals.currency.toLocaleString()}</div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="pay" checked={payWithPoints} onChange={() => setPayWithPoints(true)} />
                  <span className="text-sm text-slate-300">Pay with points</span>
                </label>
                <label className="inline-flex items-center gap-2 ml-4">
                  <input type="radio" name="pay" checked={!payWithPoints} onChange={() => setPayWithPoints(false)} />
                  <span className="text-sm text-slate-300">Pay with card (UGX)</span>
                </label>
              </div>

              <div className="mt-4">
                <Button onClick={handlePlaceOrder} loading={processing} disabled={cart.length === 0}>
                  {processing ? <span className="flex items-center gap-2"><Spinner size={1.0} label="Processing..." /></span>
                    : (payWithPoints ? `Redeem ${totals.points.toLocaleString()} pts` : `Pay UGX ${totals.currency.toLocaleString()}`)}
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
