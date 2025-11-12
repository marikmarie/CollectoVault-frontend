// src/features/customer/PointsCard.tsx
import type { JSX } from "react";
import { useMemo } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { Coins } from "lucide-react";

type Props = {
  points: number;
  onBuy?: () => void;
  onRedeem?: () => void;
  small?: boolean;
};

export default function PointsCard({ points, onBuy, onRedeem, small }: Props): JSX.Element {
  const fmt = useMemo(() => points.toLocaleString(), [points]);

  return (
    <Card className={`p-5 ${small ? "flex items-center gap-4" : ""}`}>
      <div className={small ? "flex-1 flex items-center gap-4" : ""}>
        <div className="rounded-full bg-emerald-500/10 p-3 flex items-center justify-center">
          <Coins className="w-6 h-6 text-amber-400" />
        </div>

        <div>
          <div className="text-sm text-slate-300">Your points</div>
          <div className="text-3xl font-extrabold text-slate-100">{fmt} pts</div>
          {!small && <div className="text-sm text-slate-400 mt-1">Points can be redeemed for rewards or used during checkout.</div>}
        </div>
      </div>

      <div className="mt-4 sm:mt-0 sm:ml-6 flex gap-3">
        <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={onBuy}>Buy points</Button>
        <Button variant="ghost" onClick={onRedeem}>Redeem</Button>
      </div>
    </Card>
  );
}
