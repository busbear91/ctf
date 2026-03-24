import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /challenges — redirect to / if no team cookie
  if (pathname.startsWith('/challenges')) {
    const teamCookie = req.cookies.get('ctf_team_session')
    if (!teamCookie) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/challenges/:path*'],
}
