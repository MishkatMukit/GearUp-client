import { redirect } from "next/navigation"
import { getMe } from "@/service/auth"

export default async function DashboardPage() {
  const user = await getMe()

  if (!user) redirect("/auth/login")

  if (user.role === "PROVIDER") {
    redirect("/dashboard/provider")
  }

  redirect("/dashboard/customer")
}
