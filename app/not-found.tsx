import Link from 'next/link'
import { Backpack, Mountain, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        {/* Icon Composition */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-32 w-32">
            {/* Mountain backdrop */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Mountain className="h-24 w-24 text-muted-foreground/30" strokeWidth={1} />
            </div>
            {/* Wind element */}
            <div className="absolute right-0 top-2">
              <Wind className="h-8 w-8 animate-pulse text-muted-foreground/50" />
            </div>
            {/* Backpack (404) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Backpack className="h-16 w-16 text-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-8">
          <h1 className="text-5xl font-bold text-foreground sm:text-6xl">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Lost on the Trail</h2>
          <p className="text-base text-muted-foreground">
            It looks like the page you&apos;re searching for has wandered off. Don&apos;t worry—we&apos;ll help you find your way back to the right gear.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 justify-center">
          <Link href="/gear" className="flex-1">
            <Button className="w-full">Browse Gear</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">Go Home</Button>
          </Link>
        </div>

        {/* Subtle decorative element */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>GearUp Marketplace</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </div>
  )
}
