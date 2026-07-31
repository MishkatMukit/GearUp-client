"use client"

import { useRef, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

function ResultsSkeleton() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
      <div className="h-fit rounded-xl border bg-card p-5 shadow-sm">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card shadow-sm">
              <div className="aspect-4/3 animate-pulse rounded-t-xl bg-muted" />
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
      <div className="mx-auto mt-8 max-w-xl">
        <div className="relative w-full">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={searchParams.get("searchTerm") ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search by name or brand..."
            className="h-12 pl-10"
          />
        </div>
      </div>
      {isPending ? <ResultsSkeleton /> : children}
    </div>
  )
}
