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
            GearUp connects you with trusted local providers offering quality photography and filmmaking equipment. Browse, compare, and rent cameras, lenses, lighting, audio gear, and production equipment through a simple, secure, and reliable marketplace.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/gear"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-slate-900 shadow transition-colors hover:bg-white/90"
            >
              Browse Gear
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
