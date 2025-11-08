// src/features/customer/dashboard/RewardsList.tsx
import Card from "../../../components/common/Card";

const rewards = [
  { id: 1, name: "Free Drink", cost: 200 },
  { id: 2, name: "10% Discount", cost: 500 },
  { id: 3, name: "Merch Pack", cost: 1200 },
];

export default function RewardsList() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Rewards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map((r) => (
          <Card key={r.id} className="p-4 flex justify-between items-center border border-slate-700">
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-slate-400">{r.cost} pts</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-md text-sm">
              Redeem
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
