import { useState, useEffect } from 'react'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'customers', label: 'Customers' },
  { key: 'leads', label: 'Leads' },
  { key: 'activities', label: 'Activities' },
  { key: 'tickets', label: 'Tickets' },
]

export default function Navbar({ current, onChange }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = localStorage.getItem('auth_user')
      if (u) setUser(JSON.parse(u))
    } catch {}
  }, [])

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
  }

  return (
    <header className="bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 sticky top-0 z-10 border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold">Flames CRM</span>
        </div>
        <nav className="hidden md:flex gap-2 items-center">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`px-3 py-2 rounded text-sm transition-colors ${current === t.key ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700/60'}`}
            >
              {t.label}
            </button>
          ))}
          <div className="pl-4 ml-2 border-l border-slate-700 text-slate-300 text-sm flex items-center gap-2">
            <span>{user?.name || 'User'}</span>
            <button onClick={logout} className="text-slate-400 hover:text-white underline/hover">Logout</button>
          </div>
        </nav>
        <button className="md:hidden text-slate-200" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { onChange(t.key); setOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 ${current === t.key ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700/60'}`}
            >
              {t.label}
            </button>
          ))}
          <button onClick={logout} className="w-full text-left text-slate-300 underline">Logout</button>
        </div>
      )}
    </header>
  )
}
