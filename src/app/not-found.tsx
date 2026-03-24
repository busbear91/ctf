import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <Shield className="w-12 h-12 text-red-DEFAULT mx-auto opacity-40" strokeWidth={1.5} />
        <h1 className="text-6xl font-bold text-text-muted font-mono">404</h1>
        <p className="text-text-secondary">Page not found</p>
        <Link href="/" className="inline-block text-red-DEFAULT hover:underline text-sm">← Back to home</Link>
      </div>
    </div>
  )
}
