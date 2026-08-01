import { PackageSearch } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RentalStatusBadge } from "@/components/shared/StatusBadge"
import type { ApiRentalOrder } from "@/lib/types"
import { GearThumb } from "@/components/shared/GearThumb"
import { formatDate, formatMoney } from "@/lib/format"

export function OrdersTable({ rentals, limit }: { rentals: ApiRentalOrder[]; limit?: number }) {
  const rows = limit ? rentals.slice(0, limit) : rentals

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        <PackageSearch className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">No rental orders yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          When you rent gear, your orders will show up here with their current status.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Rental Period</TableHead>
          <TableHead>Days</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((rental) => (
          <TableRow key={rental.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <GearThumb src={rental.gearItem?.images?.[0]} alt={rental.gearItem?.name ?? "Gear"} />
                <div className="min-w-0">
                  <p className="max-w-48 truncate font-medium">
                    {rental.gearItem?.name ?? "Gear item"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {rental.gearItem?.brand ?? "—"}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <p className="font-medium">{formatDate(rental.startDate)}</p>
              <p className="text-xs text-muted-foreground">to {formatDate(rental.endDate)}</p>
            </TableCell>
            <TableCell>{rental.days}</TableCell>
            <TableCell className="text-right">{rental.quantity}</TableCell>
            <TableCell className="text-right font-medium">{formatMoney(rental.totalAmount)}</TableCell>
            <TableCell>
              <RentalStatusBadge status={rental.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function OrdersTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="space-y-0 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b py-3 last:border-0">
            <div className="size-10 animate-pulse rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
