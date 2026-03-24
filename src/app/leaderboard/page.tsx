'use client'
import { useEffect, useState } from 'react'
import { NavBar } from '@/components/ui/NavBar'
import { Trophy, Medal, Lock, RefreshCw } from 'lucide-react'
import type { LeaderboardEntry, GameState } from '@/types'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/gamestate')
    const data = await res.json()
    setGameState(data.gameState)
    if (data.gameState?.leaderboard_visible && data.gameState?.leaderboard_snapshot) {
      setEntries(data.gameState.leaderboard_snapshot)
    } else {
      setEntries([])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const medalColors = ['text-amber-DEFAULT', 'text-text-secondary', 'text-amber-dim']
  const medalIcons = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-bg-primary">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              <Trophy className="w-7 h-7 text-amber-DEFAULT" />
              Leaderboard
            </h1>
            <p className="text-text-secondary text-sm mt-1">Refreshed manually by the admin</p>
          </div>
          <button onClick={load} className="btn-ghost px-3 py-2 rounded text-sm flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-amber-DEFAULT/30 border-t-amber-DEFAULT rounded-full animate-spin mx-auto mb-3" />
            <p className="text-text-secondary text-sm font-mono">Loading...</p>
          </div>
        ) : !gameState?.leaderboard_visible ? (
          <div className="text-center py-20 space-y-3">
            <Lock className="w-12 h-12 text-text-muted mx-auto" />
            <p className="text-text-primary font-medium" style={{ fontFamily: 'var(--font-display)' }}>Leaderboard is hidden</p>
            <p className="text-text-secondary text-sm">The admin will reveal the leaderboard when ready.</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-text-muted text-sm">No scores yet.</div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <div
                key={entry.team_id}
                className={`flex items-center gap-4 p-5 rounded-lg border transition-all ${
                  i === 0
                    ? 'bg-amber-dim/40 border-amber-DEFAULT/30'
                    : 'bg-bg-card border-bg-border'
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-2xl">{medalIcons[i]}</span>
                  ) : (
                    <span className="text-text-muted font-mono text-sm">#{i + 1}</span>
                  )}
                </div>

                {/* Team name */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
                    {entry.team_name}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5 font-mono">
                    {entry.solves} solve{entry.solves !== 1 ? 's' : ''}
                    {entry.last_solve_at && ` · last: ${new Date(entry.last_solve_at).toLocaleTimeString()}`}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-xl font-bold font-mono ${i === 0 ? 'text-amber-DEFAULT' : 'text-text-primary'}`}>
                    {entry.score}
                  </p>
                  <p className="text-text-muted text-xs">points</p>
                </div>

                {/* Bar */}
                <div className="hidden sm:block w-24">
                  <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${entries[0].score > 0 ? (entry.score / entries[0].score) * 100 : 0}%`,
                        background: i === 0 ? '#f4a261' : '#e63946',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
