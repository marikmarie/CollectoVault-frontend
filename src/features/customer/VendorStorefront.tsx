/* src/features/customer/VendorStorefront.tsx */
import React, { useEffect, useState } from "react";
import vendorsService from "../../api/vendorsService";
import { useNavigate, useParams } from "react-router-dom";

type Service = {
  id: string;
  title: string;
  description?: string;
  pricePoints?: number;
  priceCurrency?: number;
  active?: boolean;
  vendorId?: string;
  vendorName?: string;
};

const CART_KEY = "collectovault_cart_v1";

function loadCart(): Service[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: Service[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
}

export default function VendorStorefront() {
  const { vendorId } = useParams<{ vendorId?: string }>();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Service[]>(() => loadCart());

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if ((vendorsService as any)?.getServicesByVendor) {
          const resp = await (vendorsService as any).getServicesByVendor(vendorId);
          const data = resp?.data ?? resp;
          if (!mounted) return;
          setServices(data || []);
        } else {
          // demo list
          if (!mounted) return;
          setServices([
            { id: "s1", title: "Spa voucher - 2 hours", pricePoints: 1200, priceCurrency: 15, vendorId, vendorName: "Forest Mall", active: true },
            { id: "s2", title: "Dinner for two", pricePoints: 800, priceCurrency: 10, vendorId, vendorName: "Forest Mall", active: true },
            { id: "s3", title: "Room discount 20%", pricePoints: 2000, priceCurrency: 25, vendorId, vendorName: "Forest Mall", active: false },
          ]);
        }
      } catch (err: any) {
        console.warn("vendorsService.getServicesByVendor failed", err);
        setError("Failed to load services. Showing demo items.");
        setServices([
          { id: "s-demo", title: "Demo service", pricePoints: 500, priceCurrency: 5, vendorId, vendorName: "Demo Vendor", active: true },
        ]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [vendorId]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = (service: Service) => {
    const next = [...cart, service];
    setCart(next);
  };

  const removeFromCart = (id: string) => {
    setCart((c) => c.filter((i) => i.id !== id));
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/customer/checkout");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{services.length > 0 ? `${services[0].vendorName ?? "Vendor"} Store` : "Store"}</h2>
          <p className="text-sm text-slate-300">Browse services and redeem using points or pay with card.</p>
        </div>

        <div>
          <button onClick={goToCheckout} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white">
            Checkout ({cart.length})
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-6 text-slate-400">Loading services...</div>
        ) : error ? (
          <div className="col-span-full p-4 text-rose-400">{error}</div>
        ) : services.length === 0 ? (
          <div className="col-span-full p-6 text-slate-400">No services available at the moment.</div>
        ) : (
          services.map((s) => (
            <div key={s.id} className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 flex flex-col">
              <div className="flex-1">
                <div className="font-semibold text-white">{s.title}</div>
                <div className="text-sm text-slate-300 mt-1">{s.description}</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  {s.pricePoints ? <div className="text-lg font-bold">{s.pricePoints.toLocaleString()} pts</div> : null}
                  {s.priceCurrency ? <div className="text-sm text-slate-400">${s.priceCurrency.toFixed(2)}</div> : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(s)}
                    disabled={!s.active}
                    className={`px-3 py-2 rounded-md text-sm font-semibold ${!s.active ? "bg-slate-700 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
                  >
                    Add
                  </button>
                  <button onClick={() => alert("View details (demo)")} className="px-3 py-2 rounded-md border border-slate-700 text-sm">Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
