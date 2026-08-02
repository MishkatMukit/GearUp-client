import { create } from "zustand"

type ReviewFormState = {
  rating: number
  setRating: (value: number) => void
  reset: () => void
}

export const useReviewFormStore = create<ReviewFormState>((set) => ({
  rating: 0,
  setRating: (rating) => set({ rating }),
  reset: () => set({ rating: 0 }),
}))
