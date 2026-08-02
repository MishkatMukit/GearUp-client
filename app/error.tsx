'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle
              className="size-9 text-destructive"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t complete your request. Please try again or return
          to the homepage.
        </p>

        {/* Development error */}
        {error.message && process.env.NODE_ENV === 'development' && (
          <div className="mt-5 rounded-md border bg-muted/50 p-3 text-left">
            <p className="break-words font-mono text-xs text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>
            Try Again
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}