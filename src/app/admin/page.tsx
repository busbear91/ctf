'use client'
import { useState, useEffect, useCallback } from 'react'
import { Shield, Plus, Trash2, Play, Square, RefreshCw, Eye, EyeOff, Users, Activity, Flag, Trophy, LogOut, ChevronDown, ChevronUp, Minus } from 'lucide-react'
import { toast } from 'sonner'
import type { Team, Submission, GameState, Challenge } from '@/types'

type Tab = 'overview' | 'teams' | 'challenges' | 'submissions' | 'leaderboard'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [logging, setLogging] = useState(false)

  // State
  const [tab, setTab] = useState<Tab>('overview')
  const [teams, setTeams] = useState<Team[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [duration, setDuration] = useState(90)
  const [adjustTeamId, setAdjustTeamId] = useState('')
  const [adjustDelta, setAdjustDelta] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLogging(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) { setAuthed(true); toast.success('Admin access granted') }
    else { toast.error('Invalid password') }
    setLogging(false)
  }

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [tRes, cRes, sRes, gRes] = await Promise.all([
      fetch('/api/admin/teams'),
      fetch('/api/admin/challenges'),
      fetch('/api/admin/submissions'),
      fetch('/api/gamestate'),
    ])
    if (tRes.status === 401) { setAuthed(false); return }
    const [t, c, s, g] = await Promise.all([tRes.json(), cRes.json(), sRes.json(), gRes.json()])
    setTeams(t.teams || [])
    setChallenges(c.challenges || [])
    setSubmissions(s.submissions || [])
    setGameState(g.gameState)
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) loadAll() }, [authed, loadAll])

  async function createTeam(e: React.FormEvent) {
    e.preventDefault()
    if (!newTeamName.trim()) return
    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTeamName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      toast.success(`Team "${data.team.name}" created — code: ${data.team.join_code}`)
      setNewTeamName('')
      loadAll()
    } else toast.error(data.error)
  }

  async function deleteTeam(id: string, name: string) {
    if (!confirm(`Delete team "${name}"? This cannot be undone.`)) return
    await fetch('/api/admin/teams', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    toast.success('Team deleted')
    loadAll()
  }

  async function timerAction(action: string) {
    await fetch('/api/admin/timer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, duration_minutes: duration }),
    })
    toast.success(`Timer ${action}ed`)
    loadAll()
  }

  async function toggleChallenge(id: number, is_visible: boolean) {
    await fetch('/api/admin/challenges', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_visible }),
    })
    loadAll()
  }

  async function adjustScore(e: React.FormEvent) {
    e.preventDefault()
    if (!adjustTeamId || !adjustDelta) return
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: adjustTeamId, delta: parseInt(adjustDelta) }),
    })
    toast.success('Score adjusted')
    setAdjustDelta('')
    loadAll()
  }

  async function snapshotLeaderboard() {
    const res = await fetch('/api/admin/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'snapshot' }),
    })
    if (res.ok) { toast.success('Leaderboard published!'); loadAll() }
  }

  async function hideLeaderboard() {
    await fetch('/api/admin/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hide' }),
    })
    toast.success('Leaderboard hidden')
    loadAll()
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthed(false)
  }

  // ── Login screen ────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-red-DEFAULT mx-auto mb-3 flicker" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            Admin Panel
          </h1>
          <p className="text-text-secondary text-sm mt-1">CyDef CTF — Restricted Access</p>
        </div>
        <div className="bg-bg-card border border-bg-border rounded-lg p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-bg-secondary border border-bg-border rounded px-4 py-3 text-text-primary font-mono text-sm placeholder:text-text-muted"
            />
            <button type="submit" disabled={logging} className="btn-red w-full py-3 rounded text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {logging ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shield className="w-4 h-4" />}
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'teams', label: `Teams (${teams.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Flag className="w-4 h-4" /> },
    { id: 'submissions', label: 'Submissions', icon: <Activity className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
  ]

  const correctSubs = submissions.filter(s => s.is_correct)

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Admin nav */}
      <nav className="border-b border-bg-border bg-bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-DEFAULT" strokeWidth={1.5} />
            <span className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              CyDef <span className="text-red-DEFAULT">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {gameState?.timer_running && (
              <span className="text-xs bg-green-dim text-green-DEFAULT border border-green-DEFAULT/30 px-2 py-0.5 rounded font-mono animate-pulse">
                LIVE
              </span>
            )}
            <button onClick={() => loadAll()} className="text-text-muted hover:text-text-primary transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={logout} className="text-text-muted hover:text-red-DEFAULT transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-bg-border overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-red-DEFAULT text-red-DEFAULT'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ─────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Teams', value: teams.length, color: 'text-red-DEFAULT' },
                { label: 'Correct Flags', value: correctSubs.length, color: 'text-green-DEFAULT' },
                { label: 'Total Submissions', value: submissions.length, color: 'text-amber-DEFAULT' },
                { label: 'Challenges Live', value: challenges.filter(c => c.is_visible).length + '/' + challenges.length, color: 'text-text-primary' },
              ].map(s => (
                <div key={s.label} className="bg-bg-card border border-bg-border rounded-lg p-4">
                  <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Timer control */}
            <div className="bg-bg-card border border-bg-border rounded-lg p-5">
              <h2 className="font-semibold text-text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Event Timer
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-text-secondary text-sm">Duration (min):</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-20 bg-bg-secondary border border-bg-border rounded px-3 py-1.5 text-text-primary font-mono text-sm"
                    min={1} max={480}
                  />
                </div>
                <button onClick={() => timerAction('start')} disabled={!!gameState?.timer_running}
                  className="btn-red px-4 py-2 rounded text-sm flex items-center gap-2 disabled:opacity-40">
                  <Play className="w-4 h-4" /> Start
                </button>
                <button onClick={() => timerAction('stop')} disabled={!gameState?.timer_running}
                  className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2 disabled:opacity-40">
                  <Square className="w-4 h-4" /> Stop
                </button>
                <button onClick={() => timerAction('reset')}
                  className="btn-ghost px-4 py-2 rounded text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Reset
                </button>
                {gameState?.timer_running && (
                  <span className="text-green-DEFAULT text-sm font-mono">
                    ● Running — started {gameState.start_time ? new Date(gameState.start_time).toLocaleTimeString() : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Score adjustment */}
            <div className="bg-bg-card border border-bg-border rounded-lg p-5">
              <h2 className="font-semibold text-text-primary mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Manual Score Adjustment
              </h2>
              <form onSubmit={adjustScore} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="text-text-muted text-xs block mb-1">Team</label>
                  <select
                    value={adjustTeamId}
                    onChange={e => setAdjustTeamId(e.target.value)}
                    className="bg-bg-secondary border border-bg-border rounded px-3 py-2 text-text-primary text-sm min-w-40"
                  >
                    <option value="">Select team...</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Points (use − for deduction)</label>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={e => setAdjustDelta(e.target.value)}
                    placeholder="e.g. 50 or -50"
                    className="w-36 bg-bg-secondary border border-bg-border rounded px-3 py-2 text-text-primary font-mono text-sm"
                  />
                </div>
                <button type="submit" className="btn-red px-4 py-2 rounded text-sm">Apply</button>
              </form>
            </div>
          </div>
        )}

        {/* ── Teams ─────────────────────────────────────────── */}
        {tab === 'teams' && (
          <div className="space-y-5">
            <form onSubmit={createTeam} className="flex gap-3">
              <input
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="New team name..."
                className="flex-1 bg-bg-card border border-bg-border rounded px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted"
              />
              <button type="submit" className="btn-red px-4 py-2.5 rounded text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Team
              </button>
            </form>

            <div className="bg-bg-card border border-bg-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bg-border text-left">
                    <th className="px-5 py-3 text-text-muted font-medium text-xs uppercase tracking-widest">Team Name</th>
                    <th className="px-5 py-3 text-text-muted font-medium text-xs uppercase tracking-widest">Join Code</th>
                    <th className="px-5 py-3 text-text-muted font-medium text-xs uppercase tracking-widest">Score</th>
                    <th className="px-5 py-3 text-text-muted font-medium text-xs uppercase tracking-widest">Solves</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map(team => {
                    const solves = correctSubs.filter(s => s.team_id === team.id).length
                    return (
                      <tr key={team.id} className="border-b border-bg-border last:border-0 hover:bg-bg-secondary/50">
                        <td className="px-5 py-3 font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>{team.name}</td>
                        <td className="px-5 py-3">
                          <code className="bg-bg-secondary border border-bg-border px-2 py-0.5 rounded text-red-DEFAULT text-xs">{team.join_code}</code>
                        </td>
                        <td className="px-5 py-3 font-mono text-green-DEFAULT">{team.score}</td>
                        <td className="px-5 py-3 text-text-secondary font-mono">{solves}</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => deleteTeam(team.id, team.name)} className="text-text-muted hover:text-red-DEFAULT transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {teams.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-text-muted text-sm">No teams yet. Create one above.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Challenges ─────────────────────────────────────── */}
        {tab === 'challenges' && (
          <div className="space-y-3">
            {challenges.map(ch => (
              <div key={ch.id} className="bg-bg-card border border-bg-border rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-text-muted font-mono text-sm w-6">Q{ch.id}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>{ch.title}</p>
                    <p className="text-text-muted text-xs font-mono">{ch.topic} · {ch.difficulty} · {ch.points}pts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-text-muted font-mono">
                    {correctSubs.filter(s => s.challenge_id === ch.id).length} solves
                  </span>
                  <button
                    onClick={() => toggleChallenge(ch.id, !ch.is_visible)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-all ${
                      ch.is_visible
                        ? 'border-green-DEFAULT/40 text-green-DEFAULT bg-green-dim'
                        : 'border-bg-border text-text-muted hover:border-red-DEFAULT/40'
                    }`}
                  >
                    {ch.is_visible ? <><Eye className="w-3 h-3" /> Visible</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Submissions ────────────────────────────────────── */}
        {tab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex gap-4 text-sm">
              <span className="text-green-DEFAULT font-mono">{correctSubs.length} correct</span>
              <span className="text-red-DEFAULT font-mono">{submissions.filter(s => !s.is_correct).length} wrong</span>
            </div>
            <div className="bg-bg-card border border-bg-border rounded-lg overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-bg-card border-b border-bg-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Time</th>
                      <th className="px-4 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Team</th>
                      <th className="px-4 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Challenge</th>
                      <th className="px-4 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Flag</th>
                      <th className="px-4 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(s => (
                      <tr key={s.id} className="border-b border-bg-border last:border-0 hover:bg-bg-secondary/30">
                        <td className="px-4 py-2.5 text-text-muted font-mono text-xs">{new Date(s.submitted_at).toLocaleTimeString()}</td>
                        <td className="px-4 py-2.5 text-text-primary font-medium" style={{ fontFamily: 'var(--font-display)' }}>{s.teams?.name || '—'}</td>
                        <td className="px-4 py-2.5 text-text-secondary text-xs">{s.challenges?.title || `Q${s.challenge_id}`}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-text-muted max-w-40 truncate">{s.flag_submitted}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${s.is_correct ? 'bg-green-dim text-green-DEFAULT' : 'bg-red-dim text-red-DEFAULT'}`}>
                            {s.is_correct ? '✓ correct' : '✗ wrong'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted text-sm">No submissions yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Leaderboard ────────────────────────────────────── */}
        {tab === 'leaderboard' && (
          <div className="space-y-5">
            <div className="bg-bg-card border border-bg-border rounded-lg p-5 space-y-4">
              <div>
                <h2 className="font-semibold text-text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>Publish Leaderboard</h2>
                <p className="text-text-secondary text-sm">Taking a snapshot freezes current scores and makes them visible to participants.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={snapshotLeaderboard} className="btn-red px-5 py-2.5 rounded text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Snapshot & Publish
                </button>
                <button onClick={hideLeaderboard} className="btn-ghost px-5 py-2.5 rounded text-sm flex items-center gap-2">
                  <EyeOff className="w-4 h-4" /> Hide Leaderboard
                </button>
              </div>
              <p className={`text-xs font-mono ${gameState?.leaderboard_visible ? 'text-green-DEFAULT' : 'text-text-muted'}`}>
                Status: {gameState?.leaderboard_visible ? '● Visible to participants' : '○ Hidden'}
              </p>
            </div>

            {/* Current standings preview */}
            <div className="bg-bg-card border border-bg-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-bg-border">
                <p className="text-text-secondary text-sm">Live standings (admin view — not shown to participants until published)</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bg-border">
                    <th className="px-5 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Rank</th>
                    <th className="px-5 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Team</th>
                    <th className="px-5 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Score</th>
                    <th className="px-5 py-3 text-left text-text-muted font-medium text-xs uppercase tracking-widest">Solves</th>
                  </tr>
                </thead>
                <tbody>
                  {[...teams].sort((a, b) => b.score - a.score).map((t, i) => (
                    <tr key={t.id} className="border-b border-bg-border last:border-0 hover:bg-bg-secondary/30">
                      <td className="px-5 py-3 text-text-muted font-mono text-xs">#{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>{t.name}</td>
                      <td className="px-5 py-3 font-mono text-green-DEFAULT">{t.score}</td>
                      <td className="px-5 py-3 text-text-secondary font-mono">{correctSubs.filter(s => s.team_id === t.id).length}</td>
                    </tr>
                  ))}
                  {teams.length === 0 && (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-text-muted text-sm">No teams yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
