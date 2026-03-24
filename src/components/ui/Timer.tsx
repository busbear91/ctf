'use client'
import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import type { GameState } from '@/types'

export function Timer({ gameState }: { gameState: GameState | null }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!gameState?.timer_running || !gameState.start_time) {
      setRemaining(null)
      return
    }
    function calc() {
      const elapsed = (Date.now() - new Date(gameState!.start_time!).getTime()) / 1000
      const total = (gameState!.duration_minutes || 90) * 60
      setRemaining(Math.max(0, total - elapsed))
    }
    calc()
    const iv = setInterval(calc, 1000)
    return () => clearInterval(iv)
  }, [gameState])

  if (remaining === null) return null

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = Math.floor(remaining % 60)
  const pct = gameState ? (remaining / (gameState.duration_minutes * 60)) * 100 : 100
  const urgent = pct < 20

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm font-mono ${
      urgent
        ? 'border-red-DEFAULT/60 bg-red-dim text-red-DEFAULT animate-pulse-slow'
        : 'border-bg-border bg-bg-card text-text-primary'
    }`}>
      <Clock className="w-3.5 h-3.5" />
      <span>
        {h > 0 && `${h}:`}
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </div>
  )
}
