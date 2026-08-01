import { ClipboardList } from "lucide-react"
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
import { OrderActions } from "@/app/(dashboardGroup)/dashboard/provider/_components/OrderActions"

export function ProviderOrdersTable({
  orders,
  limit,
}: {
  orders: ApiRentalOrder[]
  limit?: number
}) {
  const rows = limit ? orders.slice(0, limit) : orders

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        <ClipboardList className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">No incoming orders</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          When customers rent your gear, their orders will show up here.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Rental Period</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <GearThumb
                  src={order.gearItem?.images?.[0]}
                  alt={order.gearItem?.name ?? "Gear"}
                />
                <div className="min-w-0">
                  <p className="max-w-40 truncate font-medium">
                    {order.gearItem?.name ?? "Gear item"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.gearItem?.brand ?? "—"}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <p className="max-w-32 truncate font-medium">
                {order.customer?.name ?? "Customer"}
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                {order.customerId.slice(0, 8)}
              </p>
            </TableCell>
            <TableCell>
              <p className="font-medium">{formatDate(order.startDate)}</p>
              <p className="text-xs text-muted-foreground">to {formatDate(order.endDate)}</p>
            </TableCell>
            <TableCell className="text-right">{order.quantity}</TableCell>
            <TableCell className="text-right font-medium">
              {formatMoney(order.totalAmount)}
            </TableCell>
            <TableCell>
              <RentalStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right">
              <OrderActions order={order} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function ProviderOrdersTableSkeleton() {
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
