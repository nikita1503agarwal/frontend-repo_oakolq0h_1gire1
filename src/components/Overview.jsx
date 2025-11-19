import { useEffect, useState } from 'react'

export default function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/analytics/overview`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Dashboard</h2>
      {error && <p className="text-red-400">{error}</p>}
      {!data ? (
        <p className="text-slate-300">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat title="Customers" value={data.totals.customers} />
          <Stat title="Leads" value={data.totals.leads} />
          <Stat title="Open Tickets" value={data.totals.open_tickets} />
          <Stat title="Activities" value={data.totals.activities} />
        </div>
      )}

      {data?.pipeline?.length > 0 && (
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h3 className="text-slate-200 font-medium mb-2">Leads by Status</h3>
          <div className="space-y-2">
            {data.pipeline.map(row => (
              <div key={row.status} className="flex items-center justify-between text-slate-300">
                <span className="capitalize">{row.status}</span>
                <span className="font-semibold">{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ title, value }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <p className="text-slate-300 text-sm">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  )
}
