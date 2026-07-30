import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Need Gear? Rent It Instead.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            GearUp connects you with trusted local providers offering quality equipment for outdoor activities, work, and everyday use. Browse, compare, and rent the gear you need through a simple, secure, and reliable marketplace.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/gear"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Browse Gear
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
