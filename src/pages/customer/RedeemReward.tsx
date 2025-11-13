// /* src/features/customer/RedeemReward.tsx */
// import { useState } from "react";
// import Button from "../../components/common/Button";
// import Card from "../../components/common/Card";
// import api from "../../api";
// import { useSession } from "../../hooks/useSession";

// type Reward = {
//   id?: string | number;
//   title: string;
//   description?: string;
//   pointsPrice?: number | null;
//   currencyPrice?: number | null; // UGX
//   vendorName?: string;
// };

// export default function RedeemReward({
//   reward,
//   onDone,
// }: {
//   reward: Reward;
//   onDone?: (message?: string) => void;
// }) {
//   const { user, refresh } = (useSession() as any) ?? { user: null, refresh: undefined };
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleRedeemWithPoints = async () => {
//     if (!user) {
//       setError("Please log in to redeem rewards.");
//       return;
//     }
//     if (!reward?.id) {
//       setError("Invalid reward.");
//       return;
//     }
//     setProcessing(true);
//     setError(null);

//     try {
//       // backend expects authenticated user (token sent by api instance)
//       const payload = { rewardId: String(reward.id), method: "points" };
//       const { data } = await api.post("/rewards/redeem", payload);

//       // refresh session so points balance updates across the app
//       if (refresh) await refresh();

//       const message = data?.message ?? "Redeemed successfully. Enjoy your reward!";
//       onDone?.(message);
//     } catch (err: any) {
//       console.error("redeem error", err);
//       const msg = err?.response?.data?.message ?? err?.message ?? "Failed to redeem. Try again.";
//       setError(msg);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handlePayWithCard = async () => {
//     if (!user) {
//       setError("Please log in to purchase this reward.");
//       return;
//     }
//     if (!reward?.id) {
//       setError("Invalid reward.");
//       return;
//     }
//     setProcessing(true);
//     setError(null);

//     try {
//       // Create an order for this single reward; backend should create payment session or process payment
//       const orderPayload = {
//         items: [
//           {
//             id: String(reward.id),
//             qty: 1,
//             pricePoints: reward.pointsPrice ?? null,
//             priceCurrency: reward.currencyPrice ?? null,
//             title: reward.title,
//             vendorId: null,
//           },
//         ],
//         payWith: "currency",
//         currency: "UGX",
//       };

//       const { data } = await api.post("/orders", orderPayload);

//       // If backend returned a payment redirect, follow it
//       if (data?.redirectUrl) {
//         window.location.href = data.redirectUrl;
//         return;
//       }

//       // Otherwise assume immediate success
//       if (refresh) await refresh();
//       const message = data?.message ?? "Payment successful. Your reward will be processed.";
//       onDone?.(message);
//     } catch (err: any) {
//       console.error("payment error", err);
//       const msg = err?.response?.data?.message ?? err?.message ?? "Payment failed. Try again.";
//       setError(msg);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const userPoints = user?.points ?? 0;
//   const needPoints = reward?.pointsPrice ?? 0;
//   const canRedeem = userPoints >= needPoints && needPoints > 0;

//   return (
//     <div>
//       <Card>
//         <div className="space-y-3">
//           <div>
//             <div className="text-lg font-semibold">{reward.title}</div>
//             {reward.vendorName && <div className="text-sm text-slate-400">{reward.vendorName}</div>}
//             {reward.description && <div className="text-sm text-slate-300 mt-2">{reward.description}</div>}
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div className="bg-slate-900/30 p-3 rounded">
//               <div className="text-sm text-slate-400">Points price</div>
//               <div className="text-2xl font-bold">{reward.pointsPrice ? `${reward.pointsPrice.toLocaleString()} pts` : "—"}</div>
//             </div>
//             <div className="bg-slate-900/30 p-3 rounded">
//               <div className="text-sm text-slate-400">Currency</div>
//               <div className="text-2xl font-bold">{reward.currencyPrice ? `UGX ${Number(reward.currencyPrice).toLocaleString()}` : "—"}</div>
//             </div>
//           </div>

//           {error && <div className="text-sm text-rose-400">{error}</div>}

//           <div className="flex items-center gap-3 justify-end">
//             {reward.pointsPrice ? (
//               <Button
//                 onClick={handleRedeemWithPoints}
//                 loading={processing}
//                 disabled={processing || !canRedeem}
//                 title={!canRedeem ? "You don't have enough points" : undefined}
//               >
//                 Redeem with points
//               </Button>
//             ) : null}

//             {reward.currencyPrice ? (
//               <Button variant="secondary" onClick={handlePayWithCard} loading={processing} disabled={processing}>
//                 Pay UGX {reward.currencyPrice?.toLocaleString()}
//               </Button>
//             ) : null}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
