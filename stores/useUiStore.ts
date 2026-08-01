import { create } from "zustand"

type UiState = {
  mobileNavOpen: boolean
  dashboardSidebarOpen: boolean
  mobileFiltersOpen: boolean
  scrolled: boolean
  setMobileNavOpen: (open: boolean) => void
  setDashboardSidebarOpen: (open: boolean) => void
  setMobileFiltersOpen: (open: boolean) => void
  setScrolled: (scrolled: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  dashboardSidebarOpen: false,
  mobileFiltersOpen: false,
  scrolled: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setDashboardSidebarOpen: (open) => set({ dashboardSidebarOpen: open }),
  setMobileFiltersOpen: (open) => set({ mobileFiltersOpen: open }),
  setScrolled: (scrolled) => set({ scrolled }),
}))
