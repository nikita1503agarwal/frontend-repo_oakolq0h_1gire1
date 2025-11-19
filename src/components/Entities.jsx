import { useEffect, useMemo, useState } from 'react'

function List({ title, endpoint, fields, afterCreate }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const url = new URL(`${baseUrl}${endpoint}`)
      if (search) url.searchParams.set('search', search)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async () => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Create failed')
      setForm({})
      afterCreate?.()
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-3 py-2 text-sm"
          />
          <button onClick={load} className="bg-blue-600 text-white px-3 py-2 rounded text-sm">Search</button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4">
        <h3 className="text-slate-200 font-medium mb-3">Quick Create</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {fields.map(f => (
            <input
              key={f.name}
              value={form[f.name] || ''}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              placeholder={f.placeholder || f.label}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-3 py-2 text-sm"
            />
          ))}
          <button onClick={createItem} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">Add</button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-300">
                {fields.map(f => (
                  <th key={f.name} className="px-3 py-2 font-medium">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-slate-700">
                  {fields.map(f => (
                    <td key={f.name} className="px-3 py-2 text-slate-200">{it[f.name] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function Customers() {
  const fields = useMemo(() => ([
    { name: 'name', label: 'Name' },
    { name: 'company', label: 'Company' },
    { name: 'email', label: 'Email' },
    { name: 'stage', label: 'Stage' },
  ]), [])
  return <List title="Customers" endpoint="/api/customers" fields={fields} />
}

export function Leads() {
  const fields = useMemo(() => ([
    { name: 'name', label: 'Name' },
    { name: 'source', label: 'Source' },
    { name: 'status', label: 'Status' },
    { name: 'value', label: 'Value' },
  ]), [])
  return <List title="Leads" endpoint="/api/leads" fields={fields} />
}

export function Activities() {
  const fields = useMemo(() => ([
    { name: 'type', label: 'Type' },
    { name: 'subject', label: 'Subject' },
    { name: 'owner', label: 'Owner' },
  ]), [])
  return <List title="Activities" endpoint="/api/activities" fields={fields} />
}

export function Tickets() {
  const fields = useMemo(() => ([
    { name: 'subject', label: 'Subject' },
    { name: 'status', label: 'Status' },
    { name: 'priority', label: 'Priority' },
  ]), [])
  return <List title="Tickets" endpoint="/api/tickets" fields={fields} />
}
