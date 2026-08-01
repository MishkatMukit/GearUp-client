"use client"

import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUiStore } from "@/stores/useUiStore"

export function MobileFiltersDrawer({ children }: { children: React.ReactNode }) {
  const open = useUiStore((s) => s.mobileFiltersOpen)
  const setMobileFiltersOpen = useUiStore((s) => s.setMobileFiltersOpen)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filters
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col border-r bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal className="size-4" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}
