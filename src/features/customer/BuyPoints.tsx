import  { useState } from "react";
import { motion } from "framer-motion";
import { Check, Coins } from "lucide-react";
import Button from "../../components/common/Button";
import Card  from "../../components/common/Card";
import Toast from "../../components/common/Toast"; 
import type { ToastType } from "../../components/common/Toast"; 

const POINT_PACKAGES = [
  { id: 1, points: 100, price: 5000 },
  { id: 2, points: 500, price: 10000 },
  { id: 3, points: 2500, price: 25000 },
  { id: 4, points: 5000, price: 45000 },
];

export default function BuyPoints() {
  const [selected, setSelected] = useState<number | null>(null);
  const [balance, setBalance] = useState(2200);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const handlePurchase = async () => {
    if (!selected) {
      setToast({ message: "Please select a package first", type: "error" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const pkg = POINT_PACKAGES.find((p) => p.id === selected);
      if (pkg) setBalance(balance + pkg.points);
      setToast({
        message: `You successfully purchased ${pkg?.points} points!`,
        type: "success",
      });
      setLoading(false);
      setSelected(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-500 flex flex-col items-center px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Buy Collecto Points
      </motion.h1>

      <Card className="w-full max-w-md text-center p-6 mb-8">
        <p className="text-gray-50 text-sm mb-2">Current Balance</p>
        <div className="flex justify-center items-center gap-2">
          <Coins className="text-yellow-500" />
          <span className="text-2xl font-semibold text-gray-800">
            {balance.toLocaleString()} pts
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-10">
        {POINT_PACKAGES.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ scale: 1.03 }}
            className={`cursor-pointer ${
              selected === pkg.id
                ? "ring-2 ring-blue-500"
                : "hover:ring-1 hover:ring-gray-300"
            }`}
            onClick={() => setSelected(pkg.id)}
          >
            <Card className="p-6 text-center space-y-3">
              <h2 className="text-xl font-bold text-gray-800">
                {pkg.points.toLocaleString()} Points
              </h2>
              <p className="text-gray-50">UGX {pkg.price.toLocaleString()}</p>
              {selected === pkg.id && (
                <div className="flex justify-center">
                  <Check className="text-green-500 w-5 h-5" />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-3 rounded-xl"
      >
        {loading ? "Processing..." : "Buy Now"}
      </Button>

      <p className="mt-4 text-sm text-gray-500 text-center max-w-md">
        *Payments will be processed securely through CollectoPay once API
        integration is complete.
      </p>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
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
