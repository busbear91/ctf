import { NextResponse } from 'next/server'
import { getTeamSession } from '@/lib/auth'
import { getServerSupabase } from '@/lib/supabase'

export async function GET() {
  const session = getTeamSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const supabase = getServerSupabase()
  const { data: team } = await supabase
    .from('teams')
    .select('id, name, score')
    .eq('id', session.teamId)
    .single()

  return NextResponse.json({ team: team || null, teamName: session.teamName })
}
