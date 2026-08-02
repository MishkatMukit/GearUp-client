"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type PaymentSuccessProps = {
  sessionId?: string
}

export function PaymentSuccess({ sessionId }: PaymentSuccessProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard/customer/orders")
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8">
          <div className="flex justify-center">
            <CheckCircle2 className="size-14 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your payment has been processed. An order confirmation has been sent to your
            email, and your rental is now secured.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Redirecting to your dashboard...
          </p>
          {sessionId && (
            <p className="mt-3 text-xs text-muted-foreground">
              Session: <span className="font-mono">{sessionId}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild>
              <Link href="/dashboard/customer/orders">View My Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/customer/payments">View Payment History</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
