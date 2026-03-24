import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('submissions')
    .select('*, teams(name), challenges(title, points)')
    .order('submitted_at', { ascending: false })
    .limit(200)
  return NextResponse.json({ submissions: data || [] })
}

export async function PATCH(req: NextRequest) {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { team_id, delta } = await req.json()
  const supabase = getServerSupabase()
  await supabase.rpc('increment_team_score', { p_team_id: team_id, p_points: delta })
  return NextResponse.json({ ok: true })
}
