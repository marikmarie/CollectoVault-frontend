// src/features/customer/BuyPointsModal.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import api from "../../api";

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
  const [packages, setPackages] = useState<Package[]>(FALLBACK_PACKAGES);
  const [selected, setSelected] = useState<string | number | null>(null);
  //const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const resp = await api.get("/api/point-packages");
        if (Array.isArray(resp.data)) setPackages(resp.data);
      } catch (e) {
        // ignore — fallback packages will be used
      }
    })();
  }, [open]);

  const handleBuy = async () => {
    if (!selected) {
      setMessage("Select a package first");
      return;
    }
    setProcessing(true);
    setMessage(null);
    try {
      // Backend should start payment via Collecto and return a payment page/url or success
      const resp = await api.post("/api/buy-points", { packageId: selected });
      // expected: { ok: true, paymentUrl?: "...", transactionId?: "..."}
      if (resp.data?.paymentUrl) {
        // redirect user to paymentUrl (if needed)
        window.location.href = resp.data.paymentUrl;
        return;
      }
      if (resp.data?.ok) {
        setMessage("Purchase initiated");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setMessage(resp.data?.message ?? "Failed to start purchase");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { if (!processing) onClose(); }}>
      <div className="p-4 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-3">Buy points</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {packages.map((p) => {
            const isSel = String(selected) === String(p.id);
            return (
              <div key={String(p.id)} onClick={() => setSelected(p.id)} className="cursor-pointer">
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
