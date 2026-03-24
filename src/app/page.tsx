'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Terminal, Lock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped] = useState('')
  const intro = 'CYDEF_CTF_v2.4 // INITIALISING...'

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      if (i <= intro.length) { setTyped(intro.slice(0, i)); i++ }
      else clearInterval(t)
    }, 45)
    return () => clearInterval(t)
  }, [])

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/team/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ join_code: joinCode.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Invalid join code'); return }
      toast.success(`Welcome, ${data.teamName}!`)
      router.push('/challenges')
    } catch {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-grid flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-glow blur-3xl pointer-events-none" />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-DEFAULT opacity-60" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-DEFAULT opacity-60" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-DEFAULT opacity-60" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-DEFAULT opacity-60" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Shield className="w-12 h-12 text-red-DEFAULT flicker" strokeWidth={1.5} />
              <Lock className="w-5 h-5 text-red-DEFAULT absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                CyDef
              </h1>
              <p className="text-xs text-red-DEFAULT tracking-[0.3em] uppercase">Capture The Flag</p>
            </div>
          </div>

          {/* Terminal line */}
          <div className="bg-bg-card border border-bg-border rounded px-4 py-2 text-left">
            <span className="text-red-DEFAULT text-xs font-mono">$ </span>
            <span className="text-text-secondary text-xs font-mono">{typed}</span>
            <span className="text-red-DEFAULT text-xs font-mono animate-pulse">_</span>
          </div>
        </div>

        {/* Login card */}
        <div className="bg-bg-card border border-bg-border rounded-lg p-8 space-y-6 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-DEFAULT to-transparent opacity-60" />

          <div>
            <h2 className="text-xl font-semibold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              Team Authentication
            </h2>
            <p className="text-text-secondary text-sm mt-1">Enter your team join code to access challenges</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary uppercase tracking-widest mb-2">
                Join Code
              </label>
              <div className="relative">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ALPHA-7734"
                  className="w-full bg-bg-secondary border border-bg-border rounded pl-10 pr-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted transition-colors"
                  maxLength={20}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-red w-full py-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Challenges
                </>
              )}
            </button>
          </form>

          <div className="flex items-start gap-2 text-xs text-text-muted border border-bg-border rounded p-3">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-DEFAULT" />
            <span>Join codes are provided by your event organiser. Each team has a unique code.</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-6 text-xs text-text-muted">
          <a href="/leaderboard" className="hover:text-red-DEFAULT transition-colors">Leaderboard</a>
          <span className="opacity-30">|</span>
          <a href="/admin" className="hover:text-red-DEFAULT transition-colors">Admin Panel</a>
        </div>
      </div>
    </main>
  )
}
