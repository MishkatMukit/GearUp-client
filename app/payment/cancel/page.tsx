import { PaymentCancel } from "@/app/payment/_components/PaymentCancel"

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; canceled?: string }>
}) {
  const { orderId } = await searchParams

  return <PaymentCancel orderId={orderId} />
}
