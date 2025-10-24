// src/components/common/RewardCard.tsx
import React from "react";
import Button from "./Button";
import Card from "./Card";
import Icon from "./Icon";

export type RewardCardProps = {
  id?: string | number;
  title: string;
  description?: string;
  pointsPrice?: number | null;       // points required to redeem (nullable)
  currencyPrice?: number | null;     // currency price (USD) if available
  vendorName?: string;
  imageUrl?: string | null;
  tags?: string[];                   // e.g. ["new", "popular"]
  availability?: "available" | "soldout" | "coming_soon";
  compact?: boolean;
  className?: string;
  isRedeeming?: boolean;
  onRedeem?: (id?: string | number) => Promise<void> | void;
  disabled?: boolean;                // force disabled
};

/**
 * RewardCard
 * Reusable card that displays a redeemable reward/service offered by a vendor.
 * Shows image, title, vendor, prices (points / currency), tags and a redeem button.
 */
export default function RewardCard({
  id,
  title,
  description,
  pointsPrice = null,
  currencyPrice = null,
  vendorName,
  imageUrl = null,
  tags = [],
  availability = "available",
  compact = false,
  className = "",
  isRedeeming = false,
  onRedeem,
  disabled = false,
}: RewardCardProps) {
  const isSoldOut = availability === "soldout";
  const isComing = availability === "coming_soon";
  const isDisabled = disabled || isSoldOut || isComing;

  const handleRedeem = async () => {
    if (isDisabled || !onRedeem) return;
    try {
      await onRedeem(id);
    } catch (err) {
  
    }
  };

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-200">
      {children}
    </div>
  );

  if (compact) {
    return (
      <Card className={`flex items-center gap-3 ${className}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-16 h-16 rounded-md object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-md bg-slate-800/30 flex items-center justify-center text-slate-300">
            <Icon name="points" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold truncate">{title}</div>
              {vendorName && <div className="text-xs text-slate-400 truncate">{vendorName}</div>}
            </div>

            <div className="text-right shrink-0">
              {pointsPrice ? <div className="text-sm font-semibold">{pointsPrice.toLocaleString()} pts</div> : null}
              {currencyPrice ? <div className="text-xs text-slate-400">${currencyPrice.toFixed(2)}</div> : null}
            </div>
          </div>
        </div>

        <div>
          <Button variant={isDisabled ? "ghost" : "primary"} onClick={handleRedeem} disabled={isDisabled} loading={isRedeeming}>
            {isSoldOut ? "Sold out" : isComing ? "Coming" : "Redeem"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col overflow-hidden ${className}`}>
      <div className="relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-slate-800/30 flex items-center justify-center text-slate-300">
            <Icon name="points" size={36} />
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          {tags?.slice(0, 2).map((t) => (
            <span key={t} className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm">
              {t}
            </span>
          ))}
          {isSoldOut && <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">Sold out</span>}
          {isComing && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">Coming soon</span>}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-semibold truncate">{title}</div>
            {vendorName && <div className="text-sm text-slate-400 mt-1 truncate">{vendorName}</div>}
          </div>

          <div className="text-right shrink-0">
            {pointsPrice ? (
              <div className="text-sm font-semibold">{pointsPrice.toLocaleString()} pts</div>
            ) : null}
            {currencyPrice ? (
              <div className="text-xs text-slate-400">{currencyPrice !== null ? `$${currencyPrice.toFixed(2)}` : null}</div>
            ) : null}
          </div>
        </div>

        {description ? <p className="text-sm text-slate-300 mt-3 line-clamp-3">{description}</p> : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* small icon for points */}
            {pointsPrice ? (
              <div className="inline-flex items-center gap-2 text-sm text-slate-300">
                <Icon name="points" />
                <span className="font-medium">{pointsPrice.toLocaleString()}</span>
                <span className="text-xs text-slate-400">pts</span>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No points price</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant={isDisabled ? "ghost" : "primary"} onClick={handleRedeem} disabled={isDisabled} loading={isRedeeming}>
              {isSoldOut ? "Sold out" : isComing ? "Notify me" : "Redeem"}
            </Button>
            <button
              className="px-3 py-1 rounded-md border border-slate-700 text-sm text-slate-300 hover:bg-slate-800"
              onClick={() => {
                // quick preview action — consumers of this component can implement navigation via onRedeem or parent handler
                // we keep this lightweight and non-invasive
                const el = document.getElementById(`reward-${id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              aria-label={`View details for ${title}`}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
