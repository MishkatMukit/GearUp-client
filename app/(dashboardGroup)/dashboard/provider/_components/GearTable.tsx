import Link from "next/link"
import { Boxes, Pencil } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ApiProviderGear } from "@/lib/types"
import { GearThumb } from "@/components/shared/GearThumb"
import { formatMoney } from "@/lib/format"
import { DeleteGearButton } from "@/app/(dashboardGroup)/dashboard/provider/_components/DeleteGearButton"

export function GearTable({ gear }: { gear: ApiProviderGear[] }) {
  if (gear.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        <Boxes className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">No gear listed yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Add your first item to start renting it out.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price / day</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/provider/gear/${item.id}/edit`}>
                    <Pencil />
                    Edit
                  </Link>
                </Button>
                <DeleteGearButton gearId={item.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function GearTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price / day</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell className="text-right">
              <div className="ml-auto flex justify-end gap-2">
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="size-8 animate-pulse rounded-md bg-muted" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
