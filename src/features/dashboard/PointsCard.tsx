// src/features/customer/dashboard/PointsCard.tsx
import type { JSX } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

type Props = {
  balance: number;
  onTopUp?: () => void;
};

export default function PointsCard({ balance, onTopUp }: Props): JSX.Element {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">Your points</div>
          <div className="text-3xl font-extrabold">{balance.toLocaleString()} pts</div>
          <div className="text-sm text-slate-400 mt-1">Use points to redeem rewards or level up your tier</div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Button onClick={onTopUp}>Buy points</Button>
          <Button variant="ghost">Earn points (transactions)</Button>
        </div>
      </div>
    </Card>
  );
}
