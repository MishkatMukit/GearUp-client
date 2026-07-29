'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" strokeWidth={1.5} />
          </div>
        </div>

        {/* Error Card */}
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Oops! Something Went Wrong
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              We encountered an unexpected error while processing your request. Our team has been notified and is working on a fix.
            </p>

            {/* Error Details (for development) */}
            {error.message && process.env.NODE_ENV === 'development' && (
              <div className="rounded-md bg-muted p-3 text-left">
                <p className="text-xs font-mono text-muted-foreground break-words">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Try Again
            </button>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Need help? Visit our{' '}
            <Link href="/" className="text-foreground hover:underline font-medium">
              support page
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
