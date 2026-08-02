import { PaymentSuccess } from "@/app/payment/_components/PaymentSuccess"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  return <PaymentSuccess sessionId={session_id} />
}
