"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CalendarCheck, CheckCircle2, LogIn } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createRentalAction } from "@/app/(publicGroup)/gear/[id]/_actions/createRental"
import type { ApiGearDetail } from "@/lib/types"
import type { User } from "@/service/auth"
import { cn } from "@/lib/utils"

type RentNowCardProps = {
  gear: ApiGearDetail
  user: User | null
}

export function RentNowCard({ gear, user }: RentNowCardProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)

  const [state, formAction, pending] = useActionState(createRentalAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0
    const diff = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000,
    )
    return Math.max(0, diff)
  }, [startDate, endDate])

  const total = days * quantity * gear.pricePerDay
  const dateError = endDate && days < 1
  const disabled = !gear.isAvailable || gear.stock < 1

  if (!user) {
    return (
      <Card className="lg:sticky lg:top-20">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Log in to rent this gear</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an account or sign in to place a rental order.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (user.role !== "CUSTOMER") {
    return (
      <Card className="lg:sticky lg:top-20">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CalendarCheck className="size-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Provider accounts can&apos;t rent</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rentals are available for customer accounts only.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/gear">Browse More Gear</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (state.success && state.data) {
    return (
      <Card className="lg:sticky lg:top-20">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <CheckCircle2 className="size-12 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold">Rental placed!</h2>
            <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
          </div>
          <dl className="w-full space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Start</dt>
              <dd className="font-medium">{state.data.startDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">End</dt>
              <dd className="font-medium">{state.data.endDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Quantity</dt>
              <dd className="font-medium">{state.data.quantity}</dd>
            </div>
            <div className="flex justify-between border-t pt-2">
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-semibold">${state.data.totalAmount.toFixed(2)}</dd>
            </div>
          </dl>
          <Button asChild className="w-full">
            <Link href="/dashboard">View My Rentals</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="lg:sticky lg:top-20">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{gear.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{gear.brand || "No brand"}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${gear.pricePerDay.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              gear.isAvailable
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {gear.isAvailable ? "Available" : "Unavailable"}
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {gear.stock} in stock
          </span>
        </div>

        {disabled ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            This gear is currently unavailable for rent.
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="gearItemId" value={gear.id} />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {dateError && (
              <p className="text-xs text-destructive">End date must be after the start date.</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={gear.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>

            {days > 0 && !dateError && (
              <div className="space-y-1.5 rounded-lg border bg-muted/50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {quantity} × ${gear.pricePerDay.toFixed(2)} × {days} day{days > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={pending || dateError || days < 1}>
              {pending ? "Placing order..." : "Rent Now"}
            </Button>

            {!state.success && state.message && (
              <p className="text-xs text-destructive">{state.message}</p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}
