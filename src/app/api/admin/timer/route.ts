import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action, duration_minutes } = await req.json()
  const supabase = getServerSupabase()

  if (action === 'start') {
    await supabase.from('game_state').upsert({
      id: 1,
      timer_running: true,
      start_time: new Date().toISOString(),
      duration_minutes: duration_minutes || 90,
    })
  } else if (action === 'stop') {
    await supabase.from('game_state').update({ timer_running: false }).eq('id', 1)
  } else if (action === 'reset') {
    await supabase.from('game_state').upsert({
      id: 1, timer_running: false, start_time: null,
      duration_minutes: duration_minutes || 90,
    })
  }
  return NextResponse.json({ ok: true })
}
