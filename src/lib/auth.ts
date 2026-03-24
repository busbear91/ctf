import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'ctf_admin_session'
const TEAM_COOKIE = 'ctf_team_session'

export function getAdminSession(): boolean {
  const cookieStore = cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === process.env.ADMIN_PASSWORD
}

export function getTeamSession(): { teamId: string; teamName: string } | null {
  const cookieStore = cookies()
  const raw = cookieStore.get(TEAM_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

export function encodeTeamSession(teamId: string, teamName: string): string {
  return Buffer.from(JSON.stringify({ teamId, teamName })).toString('base64')
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE
export const TEAM_COOKIE_NAME = TEAM_COOKIE
