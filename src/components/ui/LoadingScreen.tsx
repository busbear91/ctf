import { Shield } from 'lucide-react'

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-12 h-12">
          <Shield className="w-12 h-12 text-red-DEFAULT/20" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-red-DEFAULT/30 border-t-red-DEFAULT rounded-full animate-spin" />
          </div>
        </div>
        <p className="text-text-secondary text-sm font-mono">{message}</p>
      </div>
    </div>
  )
}
