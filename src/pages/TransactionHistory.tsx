import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { transactions } from '../data/dummy'

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 16.65z" />
  </svg>
)

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" />
  </svg>
)

const formatDate = (d?: string) => {
  try {
    return new Date(d as string).toLocaleString()
  } catch {
    return d ?? '—'
  }
}

const TransactionHistory: React.FC = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all')

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesQuery = query.trim() === '' || `${t.note} ${t.id}`.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || (filter === 'credit' ? t.points > 0 : t.points < 0)
      return matchesQuery && matchesFilter
    })
  }, [query, filter])

  const total = useMemo(() => filtered.reduce((s, t) => s + (t.points ?? 0), 0), [filtered])

  const exportCsv = () => {
    const headers = ['id', 'date', 'note', 'points']
    const rows = filtered.map(t => [t.id, t.date, (t.note || '').replace(/\n/g, ' '), String(t.points)])
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="text-sm text-slate-400 mt-1">A log of your points earned and redeemed. Use the search or filters to find specific entries.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by note or id"
                className="pl-10 pr-3 py-2 rounded-md bg-slate-800 border border-slate-700 placeholder:text-slate-500 text-white"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon className="w-4 h-4" />
              </div>
            </div>

            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="rounded-md px-3 py-2 bg-slate-800 border border-slate-700">
              <option value="all">All</option>
              <option value="credit">Credits (+)</option>
              <option value="debit">Debits (-)</option>
            </select>

            <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500 rounded-md text-sm font-semibold hover:bg-emerald-600">
              <DownloadIcon className="w-4 h-4" /> Export
            </button>
          </div>
        </header>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-400">Showing <span className="text-white font-semibold">{filtered.length}</span> entries</div>
            <div className="text-sm text-emerald-300 font-semibold">Total: {total} pts</div>
          </div>

          <div className="divide-y divide-slate-800">
            {filtered.length > 0 ? (
              filtered.map(t => (
                <div key={t.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400 w-28">{formatDate(t.date)}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium truncate">{t.note}</div>
                        <div className="text-xs text-slate-500 truncate">ID: {t.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-semibold ${t.points > 0 ? 'text-emerald-300' : 'text-rose-400'}`}>{t.points > 0 ? `+${t.points}` : t.points} pts</div>
                    <div className="text-xs text-slate-500 mt-1">{((t as any).balance ?? '') ? `${(t as any).balance} pts balance` : ''}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">No transactions matched your search or filters.</div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default TransactionHistory
