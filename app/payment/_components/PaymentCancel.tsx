import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type PaymentCancelProps = {
  orderId?: string
}

export function PaymentCancel({ orderId }: PaymentCancelProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8">
          <div className="flex justify-center">
            <XCircle className="size-14 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You cancelled the payment. No charges were made and your order is unchanged.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {orderId && (
              <Button asChild>
                <Link href={`/payment?orderId=${orderId}`}>Retry Payment</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/customer/orders">View My Orders</Link>
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
