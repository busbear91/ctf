import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { TEAM_COOKIE_NAME, encodeTeamSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { join_code } = await req.json()
  if (!join_code) return NextResponse.json({ error: 'Join code required' }, { status: 400 })

  const supabase = getServerSupabase()
  const { data: team, error } = await supabase
    .from('teams')
    .select('id, name, join_code')
    .eq('join_code', join_code.toUpperCase())
    .single()

  if (error || !team) return NextResponse.json({ error: 'Invalid join code' }, { status: 401 })

  const session = encodeTeamSession(team.id, team.name)
  const res = NextResponse.json({ teamName: team.name, teamId: team.id })
  res.cookies.set(TEAM_COOKIE_NAME, session, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 60 * 60 * 8, path: '/',
  })
  return res
}
