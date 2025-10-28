// src/pages/BuyPoints.tsx
import { useMemo, useState , type JSX} from "react";
import { motion } from "framer-motion";
import { Check, Coins, CreditCard, X } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Toast from "../../components/common/Toast";
import type { ToastType } from "../../components/common/Toast";
import Modal from "../../components/common/Modal";

const POINT_PACKAGES = [
  { id: 1, points: 100, price: 5_000 },
  { id: 2, points: 500, price: 10_000 },
  { id: 3, points: 2_500, price: 25_000 },
  { id: 4, points: 5_000, price: 45_000 },
];

export default function BuyPoints(): JSX.Element {
  const [selected, setSelected] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(2200);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedPkg = useMemo(() => POINT_PACKAGES.find((p) => p.id === selected) ?? null, [selected]);

  const handleCardClick = (id: number) => {
    setSelected((s) => (s === id ? null : id));
  };

  const openConfirm = () => {
    if (!selectedPkg) {
      setToast({ message: "Please select a package first", type: "error" });
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPkg) return;
    setProcessing(true);
    setLoading(true);
    // simulate network/payment processing
    await new Promise((r) => setTimeout(r, 1400));
    setBalance((b) => b + selectedPkg.points);
    setToast({
      message: `Successfully purchased ${selectedPkg.points.toLocaleString()} points.`,
      type: "success",
    });
    // reset selection and modal
    setSelected(null);
    setConfirmOpen(false);
    setProcessing(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white px-4 py-12 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-extrabold mb-6 text-center"
      >
        Buy Collecto Points
      </motion.h1>

      <div className="w-full max-w-4xl">
        <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <Coins className="text-amber-400 w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-300">Current point balance</div>
              <div className="text-2xl font-bold">{balance.toLocaleString()} pts</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-300 hidden sm:block">Need points fast?</div>
            <Button className="inline-flex items-center gap-2" onClick={() => setToast({ message: "Feature coming soon: Auto top-up", type: "info" })}>
              <CreditCard className="w-4 h-4" />
              Auto top-up
            </Button>
          </div>
        </Card>

        <section aria-labelledby="packages-heading" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 id="packages-heading" className="text-xl font-semibold">Choose a package</h2>
            <div className="text-sm text-slate-400">Prices shown in UGX — secure checkout via CollectoPay (demo)</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {POINT_PACKAGES.map((pkg) => {
              const isSelected = selected === pkg.id;
              return (
                <motion.div key={pkg.id} whileHover={{ scale: 1.02 }} className="relative">
                  <Card
                    onClick={() => handleCardClick(pkg.id)}
                    className={`p-5 cursor-pointer transition-shadow border ${isSelected ? "ring-2 ring-emerald-400 border-emerald-400/30 shadow-xl" : "hover:shadow-lg"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-300">Package</div>
                        <div className="text-2xl font-bold text-slate-100">{pkg.points.toLocaleString()} pts</div>
                        <div className="text-sm text-slate-400 mt-1">UGX {pkg.price.toLocaleString()}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-slate-400">Value</div>
                        <div className="text-sm font-medium text-emerald-300">{Math.round((pkg.points / pkg.price) * 100) / 100} pts/UGX</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-3 -right-3 bg-emerald-500 rounded-full p-2 shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-300 max-w-xl">
            By continuing you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>. Payments processed securely through CollectoPay when integrated.
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                if (!selectedPkg) {
                  setToast({ message: "Please select a point package first", type: "error" });
                  return;
                }
                openConfirm();
              }}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl"
            >
              {loading ? "Processing..." : "Buy Now"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setToast({ message: "Selection cleared", type: "info" });
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => { if (!processing) setConfirmOpen(false); }}>
        <div className="p-4 w-full max-w-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Confirm purchase</h3>
            <button
              aria-label="Close"
              onClick={() => setConfirmOpen(false)}
              className="rounded hover:bg-slate-800 p-1"
              disabled={processing}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Package</div>
                <div className="text-lg font-bold">{selectedPkg?.points.toLocaleString() ?? "-"} pts</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300">Price</div>
                <div className="text-lg font-semibold">UGX {selectedPkg?.price.toLocaleString() ?? "-"}</div>
              </div>
            </div>

            <div className="text-sm text-slate-400 mt-3">
              Current balance: <span className="font-medium text-slate-100">{balance.toLocaleString()} pts</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
              disabled={processing}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmPurchase}
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 inline-flex items-center gap-2"
              disabled={processing}
            >
              {processing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.2" strokeWidth="3" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Confirm purchase
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
