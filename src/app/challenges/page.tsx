'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/ui/NavBar'
import { Timer } from '@/components/ui/Timer'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { Flag, Lock } from 'lucide-react'
import type { Challenge, GameState } from '@/types'

type DiffFilter = 'all' | 'easy' | 'medium' | 'hard'

export default function ChallengesPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [solvedIds, setSolvedIds] = useState<number[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [teamName, setTeamName] = useState('')
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<DiffFilter>('all')

  const load = useCallback(async () => {
    const [cRes, sRes, gRes, mRes] = await Promise.all([
      fetch('/api/challenges'),
      fetch('/api/team/submissions'),
      fetch('/api/gamestate'),
      fetch('/api/team/me'),
    ])

    if (cRes.status === 401 || mRes.status === 401) {
      router.push('/')
      return
    }

    const [cData, sData, gData, mData] = await Promise.all([
      cRes.json(), sRes.json(), gRes.json(), mRes.json(),
    ])

    const allChallenges: Challenge[] = cData.challenges || []
    const solved: number[] = sData.solvedIds || []

    setChallenges(allChallenges)
    setSolvedIds(solved)
    setGameState(gData.gameState)
    setTeamName(mData.teamName || '')
    setScore(solved.reduce((acc, id) => {
      const ch = allChallenges.find(c => c.id === id)
      return acc + (ch?.points || 0)
    }, 0))
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  // Poll game state every 30 seconds for timer updates
  useEffect(() => {
    const iv = setInterval(async () => {
      const res = await fetch('/api/gamestate')
      if (res.ok) {
        const data = await res.json()
        setGameState(data.gameState)
      }
    }, 30000)
    return () => clearInterval(iv)
  }, [])

  function handleSolve(id: number, points: number) {
    setSolvedIds(prev => [...prev, id])
    setScore(prev => prev + points)
  }

  const filtered: Challenge[] = filter === 'all'
    ? challenges
    : challenges.filter(c => c.difficulty === filter)

  const solvedCount = solvedIds.length
  const totalPoints = challenges.reduce((a, c) => a + c.points, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-red-DEFAULT/30 border-t-red-DEFAULT rounded-full animate-spin mx-auto" />
        <p className="text-text-secondary text-sm font-mono">Decrypting challenge list...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-primary">
      <NavBar teamName={teamName} />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-3xl font-bold text-text-primary flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
            >
              <Flag className="w-7 h-7 text-red-DEFAULT" />
              Challenges
            </h1>
            <p className="text-text-secondary text-sm mt-1.5">
              {solvedCount} of {challenges.length} solved ·{' '}
              <span className="text-green-DEFAULT font-mono font-semibold">{score}</span>
              <span className="text-text-muted font-mono"> / {totalPoints} pts</span>
            </p>
          </div>
          <Timer gameState={gameState} />
        </div>

        {/* Progress bar */}
        {challenges.length > 0 && (
          <div className="mb-6 space-y-1">
            <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(solvedCount / challenges.length) * 100}%`,
                  background: 'linear-gradient(90deg, #e63946, #ff4d5a)',
                }}
              />
            </div>
          </div>
        )}

        {/* Difficulty filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as DiffFilter[]).map(f => {
            const count = f === 'all'
              ? challenges.length
              : challenges.filter(c => c.difficulty === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded text-sm font-mono transition-all border ${
                  filter === f
                    ? 'border-red-DEFAULT text-red-DEFAULT bg-red-dim'
                    : 'border-bg-border text-text-secondary hover:border-red-DEFAULT/40 hover:text-text-primary'
                }`}
              >
                {f === 'all' ? `all (${count})` : `${f} (${count})`}
              </button>
            )
          })}
        </div>

        {/* Not started state */}
        {gameState && !gameState.timer_running && !gameState.start_time ? (
          <div className="text-center py-24 space-y-4">
            <Lock className="w-10 h-10 text-text-muted mx-auto" strokeWidth={1.5} />
            <p className="text-text-primary font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Event hasn't started yet
            </p>
            <p className="text-text-secondary text-sm">
              Challenges will unlock once the admin starts the event timer.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted text-sm">
            No challenges match this filter.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map(ch => (
              <ChallengeCard
                key={ch.id}
                challenge={ch}
                solved={solvedIds.includes(ch.id)}
                onSolve={handleSolve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
