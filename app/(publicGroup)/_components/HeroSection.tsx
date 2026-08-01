import Image from "next/image"
import Link from "next/link"

const HERO_IMAGE =
  "https://i.ibb.co.com/PGg72fWC/banner.png"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950">
      <Image
        src={HERO_IMAGE}
        alt="Outdoor gear rental"
        fill
        priority
        quality={55}
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/40 to-slate-950" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
            Trusted gear marketplace
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Need Gear? Rent It Instead.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/80">
            GearUp connects you with trusted local providers offering quality
            equipment for outdoor activities, work, and everyday use. Browse,
            compare, and rent the gear you need through a simple, secure, and
            reliable marketplace.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/gear"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-slate-900 shadow transition-colors hover:bg-white/90"
            >
              Browse Gear
            </Link>
            {/* <Link
              href="/auth/register"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-8 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Get Started
            </Link> */}
          </div>
          {/* <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">1000+</p>
              <p className="mt-1 text-xs text-white/60">Gear Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">200+</p>
              <p className="mt-1 text-xs text-white/60">Providers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">10k+</p>
              <p className="mt-1 text-xs text-white/60">Rentals Completed</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
