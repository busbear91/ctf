import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action } = await req.json()
  const supabase = getServerSupabase()

  if (action === 'snapshot') {
    // Build snapshot from current scores
    const { data: teams } = await supabase
      .from('teams')
      .select('id, name, score')
      .order('score', { ascending: false })

    const snapshot = await Promise.all((teams || []).map(async (t: {id: string; name: string; score: number}) => {
      const { count } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', t.id)
        .eq('is_correct', true)
      const { data: lastSolve } = await supabase
        .from('submissions')
        .select('submitted_at')
        .eq('team_id', t.id)
        .eq('is_correct', true)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()
      return {
        team_id: t.id, team_name: t.name, score: t.score,
        solves: count || 0,
        last_solve_at: lastSolve?.submitted_at || null,
      }
    }))

    await supabase.from('game_state').update({
      leaderboard_visible: true,
      leaderboard_snapshot: snapshot,
    }).eq('id', 1)

    return NextResponse.json({ ok: true, snapshot })
  }

  if (action === 'hide') {
    await supabase.from('game_state').update({ leaderboard_visible: false }).eq('id', 1)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
