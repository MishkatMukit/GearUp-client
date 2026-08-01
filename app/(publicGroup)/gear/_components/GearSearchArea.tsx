"use client"

import { useRef, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function ResultsSkeleton() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
      <div className="hidden h-fit rounded-xl border bg-card p-5 shadow-sm lg:block">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-5 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 animate-pulse rounded-lg bg-muted" />
            <div className="h-9 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mt-6 h-9 animate-pulse rounded-lg bg-muted" />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card shadow-sm">
              <div className="aspect-16/10 animate-pulse rounded-t-xl bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GearSearchArea({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const debouncedReference = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (value: string) => {
    if (debouncedReference.current) {
      clearTimeout(debouncedReference.current)
    }

    debouncedReference.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("searchTerm", value)
      } else {
        params.delete("searchTerm")
      }

      params.delete("page")

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    }, 1000)
  }

  return (
    <div>
      <div className="mx-auto mt-5 max-w-xl">
        <div className="relative w-full">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchParams.get("searchTerm") ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search by name or brand..."
            className="h-11 pl-10"
          />
        </div>
      </div>
      {isPending ? <ResultsSkeleton /> : children}
    </div>
  )
}
