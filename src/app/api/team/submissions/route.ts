import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getTeamSession } from '@/lib/auth'

export async function GET() {
  const session = getTeamSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('submissions')
    .select('challenge_id, is_correct')
    .eq('team_id', session.teamId)
    .eq('is_correct', true)

  return NextResponse.json({ solvedIds: (data || []).map((s: {challenge_id: number}) => s.challenge_id) })
}
