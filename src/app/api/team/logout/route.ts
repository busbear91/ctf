import { NextResponse } from 'next/server'
import { TEAM_COOKIE_NAME } from '@/lib/auth'

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(TEAM_COOKIE_NAME)
  return res
}
