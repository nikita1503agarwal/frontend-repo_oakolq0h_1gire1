import { useState } from 'react'
import Navbar from './components/Navbar'
import Overview from './components/Overview'
import { Customers, Leads, Activities, Tickets } from './components/Entities'

function App() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar current={tab} onChange={setTab} />
      <main className="max-w-6xl mx-auto">
        {tab === 'overview' && <Overview />}
        {tab === 'customers' && <Customers />}
        {tab === 'leads' && <Leads />}
        {tab === 'activities' && <Activities />}
        {tab === 'tickets' && <Tickets />}
      </main>
    </div>
  )
}

export default App
