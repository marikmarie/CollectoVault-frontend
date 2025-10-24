/* src/features/customer/TransactionsHistory.tsx */
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import vault from "../../api/vaultClient";
import Spinner from "../../components/common/Spinner";
import { useAuth } from "../auth/useAuth";
import Card from "../../components/common/Card";

type Tx = {
  id: string;
  type: "earn" | "spend" | "purchase";
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
};

export default function TransactionsHistory(): JSX.Element {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (vault && (vault as any).get && user?.id) {
          const resp = await vault.get(`/customers/${user.id}/transactions`);
          const data = resp?.data ?? resp;
          if (mounted) setTxs(data || []);
        } else {
          // demo fallback
          if (!mounted) return;
          setTxs([
            { id: "t1", type: "earn", amount: 200, description: "Promo bonus", date: new Date().toISOString() },
            { id: "t2", type: "spend", amount: -1200, description: "Spa voucher redemption", date: new Date(Date.now() - 86400000).toISOString() },
            { id: "t3", type: "purchase", amount: -15, description: "Paid with card", currency: "USD", date: new Date(Date.now() - 172800000).toISOString() },
          ]);
        }
      } catch (err: any) {
        console.warn("Failed to fetch transactions", err);
        if (mounted) {
          setError("Failed to load transaction history. Showing demo.");
          setTxs([{ id: "t-demo", type: "earn", amount: 100, description: "Demo", date: new Date().toISOString() }]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <MainLayout title="Transactions" subtitle="Your points and payment history">
      <div>
        <Card>
          <div>
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
                      <div className="font-medium">{t.description ?? (t.type === "earn" ? "Points earned" : "Spent")}</div>
                      <div className="text-xs text-slate-400">{new Date(t.date || Date.now()).toLocaleString()}</div>
                    </div>
                    <div className={`font-semibold ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.currency ? `${t.currency}${Math.abs(t.amount).toFixed(2)}` : `${t.amount > 0 ? "+" : "-"}${Math.abs(t.amount)} pts`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
