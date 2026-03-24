import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'CyDef CTF — Capture The Flag',
  description: 'CyDef Cybersecurity Capture The Flag competition platform',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'CyDef CTF',
    description: 'Capture The Flag competition — test your cybersecurity skills',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#13131f',
              border: '1px solid #1e1e2e',
              color: '#e8e8f0',
              fontFamily: "'Exo 2', monospace",
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
