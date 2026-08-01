import { create } from "zustand"

type GearGalleryState = {
  activeIndex: number
  setActiveIndex: (index: number) => void
}

export const useGearGalleryStore = create<GearGalleryState>((set) => ({
  activeIndex: 0,
  setActiveIndex: (activeIndex) => set({ activeIndex }),
}))
