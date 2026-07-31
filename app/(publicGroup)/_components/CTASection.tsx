import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-950 px-8 py-12 text-center sm:px-12 md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Have gear to rent out?
            </h2>
            <p className="mt-2 text-sm text-white/70">
              List your equipment and start earning from your unused gear today.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-8 text-sm font-medium text-slate-900 shadow transition-colors hover:bg-white/90"
          >
            Become a Provider
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
