import Image from "next/image"
import { ImageOff } from "lucide-react"
import { normalizeImageUrl } from "@/lib/utils"

export function GearThumb({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const imageSrc = normalizeImageUrl(src)

  return (
    <div className={`relative flex size-10 shrink-0 overflow-hidden rounded-md border bg-muted ${className ?? ""}`}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <ImageOff className="size-4 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
