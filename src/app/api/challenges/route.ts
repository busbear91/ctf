import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getTeamSession } from '@/lib/auth'

export async function GET() {
  const session = getTeamSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('challenges')
    .select('id, title, scenario, task, artifact, difficulty, topic, points, hint, is_visible')
    .eq('is_visible', true)
    .order('id')

  return NextResponse.json({ challenges: data || [] })
}
