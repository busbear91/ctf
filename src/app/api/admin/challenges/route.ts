import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServerSupabase()
  const { data } = await supabase.from('challenges').select('*').order('id')
  return NextResponse.json({ challenges: data || [] })
}

export async function PATCH(req: NextRequest) {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, is_visible } = await req.json()
  const supabase = getServerSupabase()
  await supabase.from('challenges').update({ is_visible }).eq('id', id)
  return NextResponse.json({ ok: true })
}
