/* src/features/customer/Checkout.tsx */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import vault from "../../api/vaultClient";
import collectoPayments from "../../api/collectoPayments";

const CART_KEY = "collectovault_cart_v1";

type CartItem = {
  id: string;
  title: string;
  pricePoints?: number;
  priceCurrency?: number;
  vendorId?: string;
};

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {}
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const points = cart.reduce((s, i) => s + (i.pricePoints ?? 0), 0);
    const currency = cart.reduce((s, i) => s + (i.priceCurrency ?? 0), 0);
    return { points, currency };
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0) {
      // redirect back to vendors if no items
      // allow the user to land here via direct URL but display a message
    }
  }, [cart, navigate]);

  const payWithPoints = async () => {
    setError(null);
    setPaying(true);
    try {
      const balance = user?.points ?? 0;
      if (balance < totals.points) {
        setError("You do not have enough points to complete this purchase.");
        setPaying(false);
        return;
      }

      // Try vault API to create an order / redeem points
      if ((vault as any)?.post) {
        // Example API: POST /orders { items, payWith: 'points' }
        try {
          const res = await (vault as any).post("/orders", { items: cart, payWith: "points" });
          // if backend returns updated user points, update local profile
          const updatedUser = res?.data?.user;
          if (updatedUser?.points != null) updateProfile({ points: updatedUser.points });
        } catch (err) {
          console.warn("Order creation failed, falling back to demo", err);
          // fallback: deduct locally for demo
          updateProfile({ points: (user?.points ?? 0) - totals.points });
        }
      } else {
        // demo fallback — deduct points locally
        await new Promise((r) => setTimeout(r, 700));
        updateProfile({ points: (user?.points ?? 0) - totals.points });
      }

      // success
      clearCart();
      setCart([]);
      alert("Purchase successful — reward redemption completed.");
      navigate("/customer/dashboard");
    } catch (err: any) {
      console.error("payWithPoints failed", err);
      setError(err?.message ?? "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  const payWithCard = async () => {
    setError(null);
    setPaying(true);
    try {
      // Ideally we call our vault API to create an order and then call Collecto to process payment
      if ((collectoPayments as any)?.initiate) {
        const resp = await (collectoPayments as any).initiate({ amount: totals.currency, items: cart });
        // If collecto returns a redirect URL, navigate or open it.
        const redirect = resp?.data?.redirectUrl ?? resp?.redirectUrl;
        if (redirect) {
          window.location.href = redirect;
          return;
        }
      }
      // fallback demo: simulate payment success then create order in vault or just clear cart
      await new Promise((r) => setTimeout(r, 900));
      // optional: call vault to confirm order
      if ((vault as any)?.post) {
        try {
          await (vault as any).post("/orders", { items: cart, payWith: "card" });
        } catch {
          // ignore
        }
      }
      clearCart();
      setCart([]);
      alert("Payment complete (demo). Thank you!");
      navigate("/customer/dashboard");
    } catch (err: any) {
      console.error("payWithCard failed", err);
      setError(err?.message ?? "Card payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Checkout</h2>
          <p className="text-sm text-slate-300">Complete purchase with points or card.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-lg p-6">
          {cart.length === 0 ? (
            <div className="p-6 text-slate-400">Your cart is empty. Add services from the vendor storefront.</div>
          ) : (
            <ul className="space-y-4">
              {cart.map((c) => (
                <li key={c.id} className="flex items-center justify-between bg-slate-800/30 p-3 rounded">
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-slate-400">{c.vendorId}</div>
                  </div>
                  <div className="text-right">
                    {c.pricePoints ? <div className="font-semibold">{c.pricePoints.toLocaleString()} pts</div> : null}
                    {c.priceCurrency ? <div className="text-sm text-slate-400">${c.priceCurrency.toFixed(2)}</div> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="bg-slate-900/40 border border-slate-800 rounded-lg p-6">
          <div>
            <div className="text-sm text-slate-400">Summary</div>
            <div className="mt-3 flex justify-between">
              <div className="text-sm">Points total</div>
              <div className="font-semibold">{totals.points.toLocaleString()} pts</div>
            </div>
            <div className="mt-2 flex justify-between">
              <div className="text-sm">Card total</div>
              <div className="font-semibold">${totals.currency.toFixed(2)}</div>
            </div>

            <div className="mt-4">
              <button onClick={payWithPoints} disabled={paying || cart.length === 0} className={`w-full px-4 py-2 rounded-md font-semibold ${paying ? "bg-slate-600" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}>
                {paying ? "Processing..." : `Pay with points (${totals.points.toLocaleString()} pts)`}
              </button>
            </div>

            <div className="mt-3">
              <button onClick={payWithCard} disabled={paying || cart.length === 0} className={`w-full px-4 py-2 rounded-md font-semibold ${paying ? "bg-slate-600" : "border border-slate-700 hover:bg-slate-800"}`}>
                {paying ? "Processing..." : `Pay with card ($${totals.currency.toFixed(2)})`}
              </button>
            </div>

            {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
