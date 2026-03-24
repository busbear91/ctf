import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/auth'

function authGuard() {
  if (!getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const guard = authGuard(); if (guard) return guard
  const supabase = getServerSupabase()
  const { data } = await supabase.from('teams').select('*').order('score', { ascending: false })
  return NextResponse.json({ teams: data || [] })
}

export async function POST(req: NextRequest) {
  const guard = authGuard(); if (guard) return guard
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const join_code = Math.random().toString(36).substring(2, 6).toUpperCase() +
    '-' + Math.floor(1000 + Math.random() * 9000)

  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('teams')
    .insert({ name: name.trim(), join_code, score: 0 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ team: data })
}

export async function DELETE(req: NextRequest) {
  const guard = authGuard(); if (guard) return guard
  const { id } = await req.json()
  const supabase = getServerSupabase()
  await supabase.from('teams').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
