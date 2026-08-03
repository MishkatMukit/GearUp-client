import { redirect } from "next/navigation"

export default async function PaymentSuccessPage() {
  redirect("/dashboard/customer/orders")
}
