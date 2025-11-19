import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function TextInput({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="block text-slate-300 text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}

export function Login() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Login failed')
      }
      const data = await res.json()
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      navigate('/')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your CRM">
      <form onSubmit={onSubmit} className="space-y-4">
        <TextInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-slate-400 text-sm text-center mt-4">
        Don\'t have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
      </p>
    </AuthShell>
  )
}

export function Signup() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Sign up failed')
      }
      const data = await res.json()
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      navigate('/')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start using the CRM in minutes">
      <form onSubmit={onSubmit} className="space-y-4">
        <TextInput label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
        <TextInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="text-slate-400 text-sm text-center mt-4">
        Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-white text-xl font-semibold">Flames CRM</h1>
        </div>
        <h2 className="text-white text-lg font-medium">{title}</h2>
        <p className="text-slate-400 text-sm mb-4">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}
