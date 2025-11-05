/* src/features/customer/TransactionsHistory.tsx */
import { useEffect, useState, type JSX } from "react";
import Spinner from "../../components/common/Spinner";
import Card from "../../components/common/Card";
import api from "../../api";
import { useSession } from "../../hooks/useSession";

type Tx = {
  id: string;
  type: "earn" | "spend" | "purchase";
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
};

export default function TransactionsHistory(): JSX.Element {
  const { user, loading: sessionLoading } = useSession();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/customers/${user.id}/transactions`);
        if (mounted) setTxs(data || []);
      } catch (err) {
        console.warn("Failed to fetch transactions", err);
        if (mounted) {
          setError("Unable to load transaction history.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, [user]);

  if (sessionLoading) return <Spinner />;
  if (!user) return <div className="p-6 text-center">Please log in.</div>;

  return (
    <div>
      <Card>
        <h3 className="text-lg font-semibold mb-3">Recent transactions</h3>

        {loading ? (
          <div className="p-6 text-center"><Spinner /></div>
        ) : error ? (
          <div className="text-sm text-rose-400 p-3">{error}</div>
        ) : txs.length === 0 ? (
          <div className="text-slate-400">No transactions yet.</div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {txs.map((t) => (
              <li key={t.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {t.description ?? (t.type === "earn" ? "Points earned" : t.type === "spend" ? "Points spent" : "Payment")}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(t.date || Date.now()).toLocaleString()}
                  </div>
                </div>

                <div className={`font-semibold ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {t.currency
                    ? `${t.currency} ${Math.abs(t.amount).toLocaleString()}`
                    : `${t.amount > 0 ? "+" : "-"}${Math.abs(t.amount).toLocaleString()} pts`}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
