'use client'
import { useState } from 'react'
import { CheckCircle2, ChevronDown, Terminal, Eye, EyeOff, Send, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import type { Challenge } from '@/types'
import clsx from 'clsx'

interface Props {
  challenge: Challenge
  solved: boolean
  onSolve: (id: number, points: number) => void
}

export function ChallengeCard({ challenge, solved, onSolve }: Props) {
  const [open, setOpen] = useState(false)
  const [flag, setFlag] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const diffClass = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }[challenge.difficulty]

  const pointsColor = {
    easy: 'text-green-DEFAULT',
    medium: 'text-amber-DEFAULT',
    hard: 'text-red-DEFAULT',
  }[challenge.difficulty]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!flag.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/team/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challenge.id, flag: flag.trim() }),
      })
      const data = await res.json()
      if (res.status === 409) { toast.info('Already solved!'); return }
      if (!res.ok) { toast.error(data.error || 'Error submitting'); return }
      if (data.correct) {
        toast.success(`Correct! +${data.points} pts`, {
          icon: '🚩',
          style: { border: '1px solid #00ff8840', background: '#003322' },
        })
        onSolve(challenge.id, data.points)
        setOpen(false)
      } else {
        toast.error('Wrong flag. Try again.', { icon: '✗' })
        setFlag('')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={clsx(
      'ctf-card bg-bg-card border border-bg-border rounded-lg overflow-hidden transition-all',
      solved && 'solved-overlay'
    )}>
      {/* Header */}
      <button
        onClick={() => !solved && setOpen(o => !o)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={clsx('text-xs px-2 py-0.5 rounded font-mono', diffClass)}>
                {challenge.difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-bg-secondary border border-bg-border text-text-secondary font-mono">
                {challenge.topic}
              </span>
              <span className={clsx('text-xs font-mono ml-auto', pointsColor)}>
                {challenge.points} pts
              </span>
            </div>
            <h3 className="font-semibold text-text-primary" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.03em' }}>
              {solved && <CheckCircle2 className="w-4 h-4 text-green-DEFAULT inline mr-2 mb-0.5" />}
              Q{challenge.id}. {challenge.title}
            </h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed line-clamp-2">
              {challenge.scenario}
            </p>
          </div>
          {!solved && (
            <ChevronDown className={clsx(
              'w-5 h-5 text-text-muted flex-shrink-0 mt-1 transition-transform',
              open && 'rotate-180'
            )} />
          )}
        </div>
      </button>

      {/* Solved banner */}
      {solved && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 text-green-DEFAULT text-sm font-mono">
            <CheckCircle2 className="w-4 h-4" />
            Challenge solved — {challenge.points} points earned
          </div>
        </div>
      )}

      {/* Expanded content */}
      {open && !solved && (
        <div className="border-t border-bg-border px-5 pb-5 pt-4 space-y-4">
          {/* Task */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Task</p>
            <p className="text-text-secondary text-sm leading-relaxed">{challenge.task}</p>
          </div>

          {/* Artifact */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Given Material</p>
            <div className="bg-bg-secondary border border-bg-border rounded p-3 font-mono text-xs text-text-primary break-all leading-relaxed">
              {challenge.artifact}
            </div>
          </div>

          {/* Hint */}
          <div>
            <button
              onClick={() => setShowHint(h => !h)}
              className="flex items-center gap-1.5 text-xs text-amber-DEFAULT hover:text-amber-DEFAULT/80 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? <><EyeOff className="w-3 h-3" /> Hide hint</> : <><Eye className="w-3 h-3" /> Show hint</>}
            </button>
            {showHint && (
              <p className="mt-2 text-xs text-text-secondary italic bg-amber-dim/30 border border-amber-DEFAULT/20 rounded p-2 leading-relaxed">
                {challenge.hint}
              </p>
            )}
          </div>

          {/* Flag submission */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={flag}
                onChange={e => setFlag(e.target.value)}
                placeholder="FLAG{...}"
                className="w-full bg-bg-secondary border border-bg-border rounded pl-10 pr-4 py-2.5 text-text-primary font-mono text-sm placeholder:text-text-muted"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !flag.trim()}
              className="btn-red w-full py-2.5 rounded text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Flag
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
