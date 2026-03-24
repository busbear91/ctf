'use client'
import { Shield, Lock, Trophy, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavBarProps {
  teamName?: string
  isAdmin?: boolean
}

export function NavBar({ teamName, isAdmin }: NavBarProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/team/logout', { method: 'DELETE' })
    router.push('/')
  }

  return (
    <nav className="border-b border-bg-border bg-bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={isAdmin ? '/admin' : '/challenges'} className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-red-DEFAULT group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            CyDef <span className="text-red-DEFAULT">CTF</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Link href="/leaderboard" className="flex items-center gap-1.5 text-text-secondary hover:text-red-DEFAULT transition-colors text-sm">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>
          )}

          {teamName && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-px bg-bg-border" />
              <div className="flex items-center gap-1.5 text-sm">
                <Lock className="w-3.5 h-3.5 text-green-DEFAULT" />
                <span className="text-text-secondary">
                  Team: <span className="text-text-primary font-medium">{teamName}</span>
                </span>
              </div>
              <button onClick={handleLogout} className="text-text-muted hover:text-red-DEFAULT transition-colors ml-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {isAdmin && (
            <span className="text-xs bg-red-dim text-red-DEFAULT border border-red-DEFAULT/30 px-2 py-0.5 rounded font-mono">
              ADMIN
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
