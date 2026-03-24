import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getTeamSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = getTeamSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { challenge_id, flag } = await req.json()
  if (!challenge_id || !flag) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const supabase = getServerSupabase()

  // Check already solved
  const { data: existing } = await supabase
    .from('submissions')
    .select('id, is_correct')
    .eq('team_id', session.teamId)
    .eq('challenge_id', challenge_id)
    .eq('is_correct', true)
    .single()

  if (existing) return NextResponse.json({ error: 'Already solved', alreadySolved: true }, { status: 409 })

  // Get challenge
  const { data: challenge } = await supabase
    .from('challenges')
    .select('flag, points, is_visible')
    .eq('id', challenge_id)
    .single()

  if (!challenge || !challenge.is_visible)
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })

  const normalise = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '')
  const is_correct = normalise(flag) === normalise(challenge.flag)

  // Insert submission
  await supabase.from('submissions').insert({
    team_id: session.teamId,
    challenge_id,
    flag_submitted: flag.trim(),
    is_correct,
  })

  // Update score if correct
  if (is_correct) {
    await supabase.rpc('increment_team_score', {
      p_team_id: session.teamId,
      p_points: challenge.points,
    })
  }

  return NextResponse.json({ correct: is_correct, points: is_correct ? challenge.points : 0 })
}
