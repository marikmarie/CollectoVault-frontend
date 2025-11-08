// src/features/customer/dashboard/BuyPointsModal.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import api from "../../api";

type Props = {
  open: boolean;
  onClose: () => void;
  onBought?: () => void;
};

type Package = { id: number; points: number; price: number; title?: string };

export default function BuyPointsModal({ open, onClose, onBought }: Props): JSX.Element {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // load packages from backend; fallback to static if none
    (async () => {
      try {
        const resp = await api.get("/api/points/packages");
        const pkgs = resp.data ?? [
          { id: 1, points: 100, price: 5000 },
          { id: 2, points: 500, price: 10000 },
          { id: 3, points: 2500, price: 25000 },
        ];
        setPackages(pkgs);
      } catch (err) {
        setPackages([
          { id: 1, points: 100, price: 5000 },
          { id: 2, points: 500, price: 10000 },
          { id: 3, points: 2500, price: 25000 },
        ]);
      }
    })();
  }, [open]);

  const handleBuy = async () => {
    if (!selected) {
      setMessage("Please select a package");
      return;
    }
    setProcessing(true);
    setMessage(null);
    try {
      // Ask backend to create a payment / Collecto request
      const resp = await api.post("/api/points/buy", { packageId: selected });
      // server should return { ok:true, paymentUrl? , paymentRequestId? }
      if (resp.data?.paymentUrl) {
        // redirect to payment or open popup
        window.open(resp.data.paymentUrl, "_blank");
        setMessage("Opened payment page. Complete payment to receive points.");
        if (onBought) onBought();
      } else if (resp.data?.ok) {
        setMessage("Purchase queued. Points will reflect after confirmation.");
        if (onBought) onBought();
      } else {
        setMessage(resp.data?.message ?? "Unable to start purchase");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Payment initiation failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={() => !processing && onClose()}>
      <div className="p-4 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Buy points</h3>
          <div className="text-sm text-slate-400">Secure checkout via CollectoPay</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {packages.map((p) => {
            const isSel = selected === p.id;
            return (
              <div key={p.id} className={`cursor-pointer ${isSel ? "ring-2 ring-emerald-400 border-emerald-400/30" : ""}`} onClick={() => setSelected(p.id)}>
                <Card className="p-4">
                  <div className="text-sm text-slate-300">Package</div>
                  <div className="text-xl font-bold">{p.points.toLocaleString()} pts</div>
                  <div className="text-sm text-slate-400 mt-1">UGX {p.price.toLocaleString()}</div>
                </Card>
              </div>
            );
          })}
        </div>

        {message && <div className="text-sm text-amber-300 mb-3">{message}</div>}

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => onClose()} disabled={processing}>Cancel</Button>
          <Button onClick={handleBuy} disabled={processing}>
            {processing ? "Processing..." : "Proceed to pay"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
