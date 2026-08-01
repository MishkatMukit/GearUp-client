import Image from "next/image"
import Link from "next/link"
import { ImageOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { normalizeImageUrl } from "@/lib/utils"
import type { GearCardProps } from "@/lib/types"

export function GearCard({ id, name, category, brand, pricePerDay, image, availability }: GearCardProps) {
  const imageSrc = normalizeImageUrl(image)
  return (
    <Link href={`/gear/${id}`} className="block h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ImageOff className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {category}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                availability
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {availability ? "Available" : "Unavailable"}
            </span>
          </div>
          <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
          <p className="text-xs text-muted-foreground">{brand}</p>
          <p className="text-sm font-medium">
            ${pricePerDay.toFixed(2)}{" "}
            <span className="text-xs font-normal text-muted-foreground">/ day</span>
          </p>
        </div>
      </Card>
    </Link>
  )
}
