"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { submitReviewAction } from "@/app/payment/_actions/reviews"
import { useReviewFormStore } from "@/stores/useReviewFormStore"
import { cn } from "@/lib/utils"
import type { ApiRentalOrder } from "@/lib/types"

type ReviewFormProps = {
  order: ApiRentalOrder
}

export function ReviewForm({ order }: ReviewFormProps) {
  const router = useRouter()
  const rating = useReviewFormStore((s) => s.rating)
  const setRating = useReviewFormStore((s) => s.setRating)
  const reset = useReviewFormStore((s) => s.reset)

  const [state, formAction, pending] = useActionState(submitReviewAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      reset()
      router.refresh()
    } else {
      toast.error(state.message)
    }
  }, [state, router, reset])

  return (
    <form action={formAction}>
      <input type="hidden" name="gearItemId" value={order.gearItem?.id ?? ""} />
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "size-5 transition-colors",
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="comment">Comment (optional)</Label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          maxLength={500}
          placeholder="What did you think of this gear?"
          className="flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {!state.success && state.message && (
        <p className="mt-3 text-xs text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="mt-4 w-full" disabled={pending || rating === 0}>
        {pending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
