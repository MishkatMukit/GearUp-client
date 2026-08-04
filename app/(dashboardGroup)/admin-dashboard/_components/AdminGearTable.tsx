import { Boxes } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ApiProviderGear } from "@/lib/types"
import { GearThumb } from "@/components/shared/GearThumb"
import { formatDate, formatMoney } from "@/lib/format"

export function AdminGearTable({ gear }: { gear: ApiProviderGear[] }) {
  if (gear.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        <Boxes className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">No gear listed</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          All gear listings across the platform will appear here.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price / day</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Listed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gear.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <GearThumb src={item.images?.[0]} alt={item.name} />
                <div className="min-w-0">
                  <p className="max-w-48 truncate font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.brand ?? "—"}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <p className="max-w-32 truncate font-medium">
                {item.provider?.name ?? "Provider"}
              </p>
            </TableCell>
            <TableCell>{item.category?.name ?? "—"}</TableCell>
            <TableCell className="text-right font-medium">
              {formatMoney(item.pricePerDay)}
            </TableCell>
            <TableCell className="text-right">{item.stock ?? 0}</TableCell>
            <TableCell>
              {item.isAvailable ? (
                <Badge variant="green">Available</Badge>
              ) : (
                <Badge variant="red">Unavailable</Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.createdAt ? formatDate(item.createdAt) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function AdminGearTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price / day</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Listed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="size-10 animate-pulse rounded-md bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell className="text-right">
              <div className="ml-auto h-4 w-14 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell className="text-right">
              <div className="ml-auto h-4 w-8 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell>
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
