import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase'

export async function GET() {
  const supabase = getServerSupabase()
  const { data } = await supabase
    .from('game_state')
    .select('*')
    .eq('id', 1)
    .single()

  return NextResponse.json({ gameState: data })
}
