import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getGearById } from "@/service/gear"
import { getMe } from "@/service/auth"
import { GearGallery } from "@/app/(publicGroup)/gear/[id]/_components/GearGallery"
import { RentNowCard } from "@/app/(publicGroup)/gear/[id]/_components/RentNowCard"
import { ProviderCard } from "@/app/(publicGroup)/gear/[id]/_components/ProviderCard"
import { ReviewList } from "@/app/(publicGroup)/gear/[id]/_components/ReviewList"

export const dynamic = "force-dynamic"

type GearDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function GearDetailPage({ params }: GearDetailPageProps) {
  const { id } = await params
  const [gear, user] = await Promise.all([getGearById(id), getMe()])

  if (!gear) notFound()

  const specs = [
    { label: "Category", value: gear.category.name },
    { label: "Brand", value: gear.brand || "—" },
    { label: "Price", value: `$${gear.pricePerDay.toFixed(2)} / day` },
    { label: "Stock", value: String(gear.stock) },
    { label: "Availability", value: gear.isAvailable ? "Available" : "Unavailable" },
    {
      label: "Listed",
      value: new Date(gear.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    },
  ]

  return (
    <section className="pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/gear"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to Gears
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <GearGallery images={gear.images} name={gear.name} />

            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-lg font-semibold tracking-tight">Description</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{gear.description}</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold tracking-tight">Specifications</h2>
                <dl className="mt-3 divide-y divide-border rounded-xl border bg-card">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <dt className="text-muted-foreground">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <ProviderCard gear={gear} />
            </div>
          </div>

          <RentNowCard gear={gear} user={user} />
        </div>

        <ReviewList reviews={gear.reviews ?? []} />
      </div>
    </section>
  )
}
