// /* src/features/customer/PointsAward.tsx */
// import { useState, type JSX } from "react";
// import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";
// import Spinner from "../../components/common/Spinner";
// import api from "../../api"; // ✅ use actual backend API
// import { useSession } from "../../hooks/useSession"; // ✅ authenticated session user

// export default function PointsAward(): JSX.Element {
//   const { user, setUser } = useSession(); // ✅ replaces useAuth
//   const [amountUgx, setAmountUgx] = useState<number>(10000); // default UGX
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   // 1 UGX = 0.1 points (adjust if different)
//   const conversionRate = 0.1;
//   const previewPoints = Math.round(amountUgx * conversionRate);

//   const handleBuy = async () => {
//     if (!user) return setMessage("Please log in to continue.");

//     setLoading(true);
//     setMessage(null);

//     try {
//       // Call backend to create payment + credit points
//       const { data } = await api.post("/payments/buy", { amountUgx });

//       // Update user data in session
//       const userResponse = await api.get('/users/me');
//       setUser(userResponse.data);

//       setMessage(`✅ Success! You received ${data.points.toLocaleString()} points.`);
//     } catch (err: any) {
//       console.error(err);
//       setMessage(err?.response?.data?.message ?? "Payment failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="text-center p-8 text-slate-300">
//         Please log in to buy points.
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <Card>
//         <div className="grid grid-cols-1 gap-4">

//           <div>
//             <label className="block text-sm text-slate-300">Amount (UGX)</label>
//             <input
//               type="number"
//               min={1000}
//               step={1000}
//               value={amountUgx}
//               onChange={(e) => setAmountUgx(Number(e.target.value))}
//               className="mt-1 w-full rounded px-3 py-2 bg-slate-800/50 border border-slate-700"
//             />
//           </div>

//           <p className="text-sm text-slate-400">
//             Conversion: <span className="font-semibold">1 UGX = {conversionRate} points</span>
//           </p>

//           <div className="text-sm text-slate-200">
//             You will receive: <span className="font-bold">{previewPoints.toLocaleString()} points</span>
//           </div>

//           {message && <div className="text-sm text-emerald-400">{message}</div>}

//           <div className="flex items-center gap-3 justify-end">
//             <Button variant="secondary" onClick={() => setAmountUgx(10000)}>
//               Quick UGX 10,000
//             </Button>

//             <Button onClick={handleBuy} disabled={loading}>
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <Spinner size={1.2} label="Processing..." />
//                 </span>
//               ) : (
//                 "Pay & Credit Points"
//               )}
//             </Button>
//           </div>

//         </div>
//       </Card>
//     </div>
//   );
// }
