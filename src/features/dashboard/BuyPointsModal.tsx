// src/features/customer/BuyPointsModal.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import api from "../../api";
import useSession from "../../hooks/useSession";

type Package = {
  id: number | string;
  points: number;
  price: number;
  label?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const FALLBACK_PACKAGES: Package[] = [
  { id: "p1", points: 100, price: 5000 },
  { id: "p2", points: 500, price: 10000 },
  { id: "p3", points: 2500, price: 25000 },
];

export default function BuyPointsModal({ open, onClose, onSuccess }: Props): JSX.Element {
  const { user } = useSession() as any; // user may be null until loaded
  const [packages, setPackages] = useState<Package[]>(FALLBACK_PACKAGES);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Payment mode: 'momo' or 'bank' (bank disabled for now)
  const [paymentMode, setPaymentMode] = useState<"momo" | "bank">("momo");
  const [phone, setPhone] = useState<string>(user?.phone ?? "");

  useEffect(() => {
    if (!open) return;
    // reset local state when opened
    setMessage(null);
    setSelected(null);
    setPaymentMode("momo");
    setPhone(user?.phone ?? "");

    (async () => {
      try {
        const resp = await api.get("/api/point-packages");
        // Backend should return an array of packages
        if (Array.isArray(resp.data) && resp.data.length > 0) {
          setPackages(resp.data);
        } else {
          // keep fallback packages if none returned
          setPackages(FALLBACK_PACKAGES);
        }
      } catch (e) {
        // ignore — use fallback packages
        setPackages(FALLBACK_PACKAGES);
      }
    })();
  }, [open, user]);

  const handleBuy = async () => {
    setMessage(null);
    if (!selected) {
      setMessage("Please select a package first.");
      return;
    }

    if (paymentMode === "momo") {
      if (!phone || phone.trim().length < 6) {
        setMessage("Please enter a valid phone number for mobile money (MOMO).");
        return;
      }
    }

    setProcessing(true);
    try {
      // Build payload. Include customerId from session when available.
      const payload: any = {
        packageId: selected,
        paymentMode,
        phone: paymentMode === "momo" ? phone.trim() : undefined,
      };

      if (user?.id) payload.customerId = user.id;
      if (user?.businessId) payload.businessId = user.businessId; // optional, if session has it

      const resp = await api.post("/api/buy-points", payload);

      // If backend returns paymentUrl (hosted payment page), redirect the browser.
      if (resp.data?.paymentUrl) {
        // Optionally show a message then redirect
        window.location.href = resp.data.paymentUrl;
        return;
      }

      // Backend may return success immediately (e.g. if integrated) or return an 'ok' flag
      if (resp.data?.ok || resp.status === 200) {
        setMessage("Purchase initiated successfully.");
        if (onSuccess) onSuccess();
        // close modal after a short pause to allow user to read message
        setTimeout(() => {
          onClose();
        }, 700);
        return;
      }

      // Otherwise show backend message
      setMessage(resp.data?.message ?? "Failed to initiate purchase.");
    } catch (err: any) {
      // Try to provide useful message
      const text = err?.response?.data?.message ?? err?.message ?? "Payment failed";
      setMessage(String(text));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { if (!processing) onClose(); }}>
      <div className="p-4 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-3">Buy points</h3>

        <div className="text-sm text-slate-300 mb-3">
          Choose a points package and pay using mobile money (MOMO). Bank payments are coming soon.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4" role="list">
          {packages.map((p) => {
            const isSel = String(selected) === String(p.id);
            return (
              <div
                key={String(p.id)}
                onClick={() => setSelected(p.id)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(p.id); }}
                className="cursor-pointer"
                aria-pressed={isSel}
              >
                <Card className={`p-3 ${isSel ? "ring-2 ring-emerald-400 border-emerald-400/30 shadow-lg" : ""}`}>
                  <div>
                    <div className="text-sm text-slate-300">{p.label ?? "Package"}</div>
                    <div className="text-xl font-bold">{p.points.toLocaleString()} pts</div>
                    <div className="text-sm text-slate-400">UGX {p.price.toLocaleString()}</div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Payment method</div>
          <div className="flex gap-3">
            <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${paymentMode === "momo" ? "bg-emerald-600 text-white" : "bg-slate-800/40 text-slate-200"}`}>
              <input
                type="radio"
                name="paymentMode"
                value="momo"
                checked={paymentMode === "momo"}
                onChange={() => setPaymentMode("momo")}
                className="hidden"
                aria-hidden
              />
              <span className="text-sm font-medium">MOMO</span>
              <span className="text-xs text-slate-300 ml-2">Mobile money (Instant)</span>
            </label>

            <label
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800/30 text-slate-400 cursor-not-allowed"
              title="Bank payments coming soon"
            >
              <input type="radio" name="paymentMode" value="bank" disabled />
              <span className="text-sm font-medium">Bank (coming soon)</span>
            </label>
          </div>
        </div>

        {paymentMode === "momo" && (
          <div className="mb-4">
            <label className="block text-sm text-slate-200">Phone number for MOMO</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 256771234567"
              className="mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border border-slate-700 text-white"
              inputMode="tel"
              aria-label="Mobile money phone number"
            />
            <div className="text-xs text-slate-400 mt-1">We will use this phone number to initiate the mobile money payment.</div>
          </div>
        )}

        {message && <div className="text-sm text-amber-300 mb-3">{message}</div>}

        <div className="flex items-center gap-3 justify-end">
          <Button variant="ghost" onClick={onClose} disabled={processing}>Cancel</Button>
          <Button onClick={handleBuy} disabled={processing}>
            {processing ? "Processing..." : "Proceed to payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
