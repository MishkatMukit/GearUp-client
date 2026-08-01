import { Star } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn, normalizeImageUrl } from "@/lib/utils"
import type { ApiReview } from "@/lib/types"

export function ReviewList({ reviews }: { reviews: ApiReview[] }) {
  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No reviews yet for this gear.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage
                    src={normalizeImageUrl(review.customer?.profile?.profilePhoto)}
                    alt={review.customer?.name ?? "Customer"}
                  />
                  <AvatarFallback>{initials(review.customer?.name ?? "?")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {review.customer?.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted",
                    )}
                  />
                ))}
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
