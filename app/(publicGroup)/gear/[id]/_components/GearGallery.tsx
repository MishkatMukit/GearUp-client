"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

type GearGalleryProps = {
  images: string[]
  name: string
}

export function GearGallery({ images, name }: GearGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center rounded-xl border bg-muted">
        <ImageOff className="size-10 text-muted-foreground" />
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border bg-muted">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                "relative aspect-4/3 overflow-hidden rounded-lg border bg-muted transition-colors",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                sizes="150px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
