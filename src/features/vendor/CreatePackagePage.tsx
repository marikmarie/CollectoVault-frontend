// src/features/vendor/CreatePackagePage.tsx
import { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";

export default function CreatePackagePage() {
  const { user } = useSession();
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setMessage("");
    try {
      await api.post("/api/point-packages", {
        businessId: user.id,
        label,
        points,
        price,
        currency: "UGX",
      });
      setMessage("Package created successfully");
      setTimeout(() => navigate("/vendor/dashboard"), 800);
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Create Point Package</h2>
        <div>
          <label className="block text-sm mb-1">Label</label>
          <input value={label} onChange={e => setLabel(e.target.value)} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
        </div>
        <div>
          <label className="block text-sm mb-1">Points</label>
          <input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
        </div>
        <div>
          <label className="block text-sm mb-1">Price (UGX)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
        </div>

        {message && <p className="text-sm text-amber-300">{message}</p>}

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Package"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
