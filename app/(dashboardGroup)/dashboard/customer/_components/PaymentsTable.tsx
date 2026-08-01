import { ReceiptText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaymentStatusBadge } from "@/components/shared/StatusBadge"
import type { ApiPayment } from "@/lib/types"
import { formatDateTime, formatMoney } from "@/lib/format"

export function PaymentsTable({ payments, limit }: { payments: ApiPayment[]; limit?: number }) {
  const rows = limit ? payments.slice(0, limit) : payments

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        <ReceiptText className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">No payments yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Completed transactions will appear here once you pay for a rental.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <p className="font-mono text-xs font-medium">{payment.transactionId}</p>
            </TableCell>
            <TableCell>
              <p className="max-w-48 truncate font-medium">
                {payment.rentalOrder?.gearItem?.name ?? "Rental order"}
              </p>
              <p className="text-xs text-muted-foreground">
                {payment.rentalOrderId.slice(0, 8)}
              </p>
            </TableCell>
            <TableCell className="text-right font-medium">{formatMoney(payment.amount)}</TableCell>
            <TableCell>
              <PaymentStatusBadge status={payment.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDateTime(payment.paidAt ?? payment.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function PaymentsTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="space-y-0 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b py-3 last:border-0">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="ml-auto h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
