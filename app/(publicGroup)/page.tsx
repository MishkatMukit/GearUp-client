import { Suspense } from "react"
import { HeroSection } from "@/app/(publicGroup)/_components/HeroSection"
import { CategorySection } from "@/app/(publicGroup)/_components/CategorySection"
import { FeaturedGear } from "@/app/(publicGroup)/_components/FeaturedGear"
import { HowItWorks } from "@/app/(publicGroup)/_components/HowItWorks"
import { CTASection } from "@/app/(publicGroup)/_components/CTASection"

export const dynamic = "force-dynamic"

// function CategorySectionSkeleton() {
//   return (
//     <section className="py-16">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="h-8 w-64 animate-pulse rounded bg-muted" />
//         <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div key={i} className="flex h-28 animate-pulse flex-col items-center justify-center gap-3 rounded-xl border bg-card shadow-sm">
//               <div className="size-12 rounded-full bg-muted" />
//               <div className="h-4 w-20 rounded bg-muted" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

function FeaturedGearSkeleton() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card shadow-sm">
              <div className="aspect-4/3 animate-pulse rounded-t-xl bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <Suspense fallback={<CategorySectionSkeleton />}>
        <CategorySection />
      </Suspense> */}
      <Suspense fallback={<FeaturedGearSkeleton />}>
      <FeaturedGear />
      </Suspense>
      <HowItWorks />
      {/* <CTASection /> */}
    </>
  )
}
