import React, { useState } from "react";
import Button from "../common/Button";
import type { Reward } from "../../data/dummy";
import Modal from "../common/Modal";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

type Props = { reward: Reward };
{
  /* compute classes so markup stays tidy */
}

const RewardCard: React.FC<Props> = ({ reward }) => {
  const [open, setOpen] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { redeemReward } = useData();
  const { user } = useAuth();

  const userPoints = user?.points ?? 0;
  const isCustomer = user?.role === "customer";
  const canRedeem = isCustomer && userPoints >= reward.points;

  const onConfirm = async () => {
    if (!isCustomer) {
      setMessage("Please login as a customer to redeem this reward.");
      return;
    }

    if (userPoints < reward.points) {
      setMessage("You do not have enough points to redeem this reward.");
      return;
    }

    setRedeeming(true);
    try {
      const res = await redeemReward(user.id, reward.id);
      // Assume res has { success: boolean, message?: string }
      setMessage(
        res?.message ??
          (res?.success ? "Redeemed successfully!" : "Could not redeem reward.")
      );
    } catch (err: any) {
      setMessage(err?.message ?? "An error occurred while redeeming.");
    } finally {
      setRedeeming(false);
      setOpen(false);
    }
  };

  {
    /* compute classes so markup stays tidy */
  }
  const redeemBtnClass =
    isCustomer && canRedeem
      ? "bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold transition-shadow shadow-sm"
      : "bg-slate-800 text-slate-400 px-4 py-2 rounded-md font-semibold cursor-not-allowed opacity-80";

  return (
    <article className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col shadow-md hover:shadow-lg transition">
      <div className="relative rounded-md overflow-hidden h-40 mb-4 bg-linear-to-br from-green-500/30 to-emerald-400/10 flex items-center justify-center">
        {/* Placeholder image area */}
        {reward.image ? (
          <img
            src={reward.image}
            alt={reward.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-white text-lg font-semibold opacity-90">
            {reward.title}
          </div>
        )}

        {/* ribbon */}
        {reward.popular && (
          <span className="absolute left-3 top-3 bg-amber-400 text-slate-900 text-xs font-semibold px-2 py-1 rounded">
            Popular
          </span>
        )}
      </div>

      <header className="mb-2">
        <h3 className="text-white font-semibold text-lg">{reward.title}</h3>
        <div className="text-sm text-slate-400">{reward.subtitle}</div>
      </header>

      <p className="text-slate-300 text-sm flex-1 my-3 leading-relaxed">
        {reward.description}
      </p>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-300">
            {reward.points}
          </span>
          <span className="text-sm text-slate-400">pts</span>
        </div>

        {/* <div className="flex items-center gap-2">
          <Button
            label={isCustomer ? (canRedeem ? 'Redeem' : 'Not enough points') : 'Login to redeem'}
            onClick={() => setOpen(true)}
            disabled={!canRedeem}
            aria-label={`Redeem ${reward.title}`}
          />
        </div> */}

        <div className="flex items-center gap-2">
          <Button
            label={
              isCustomer
                ? canRedeem
                  ? "Redeem"
                  : "Not enough points"
                : "Login to redeem"
            }
            onClick={() => setOpen(true)}
            disabled={!canRedeem}
            aria-label={`Redeem ${reward.title}`}
            className={redeemBtnClass}
          />
        </div>
      </div>

      {message && <div className="mt-3 text-sm text-amber-300">{message}</div>}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Redeem ${reward.title}`}
      >
        <div className="text-slate-300 mb-4">
          Are you sure you want to redeem{" "}
          <strong className="text-white">{reward.title}</strong> for{" "}
          <strong className="text-emerald-300">{reward.points} pts</strong>?
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded bg-slate-700 text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={redeeming}
            className="px-4 py-2 rounded bg-emerald-500 text-white font-semibold disabled:opacity-60"
          >
            {redeeming ? "Processing..." : "Confirm Redeem"}
          </button>
        </div>
      </Modal>
    </article>
  );
};

export default RewardCard;
