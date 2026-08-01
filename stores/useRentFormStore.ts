import { create } from "zustand"

type RentFormState = {
  startDate: string
  endDate: string
  quantity: number
  setStartDate: (value: string) => void
  setEndDate: (value: string) => void
  setQuantity: (value: number) => void
  reset: () => void
}

export const useRentFormStore = create<RentFormState>((set) => ({
  startDate: "",
  endDate: "",
  quantity: 1,
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setQuantity: (quantity) => set({ quantity }),
  reset: () => set({ startDate: "", endDate: "", quantity: 1 }),
}))
