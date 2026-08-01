import { redirect } from "next/navigation"
import { getMe } from "@/service/auth"
import { DashboardShell } from "@/app/(dashboardGroup)/_components/DashboardShell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMe()

  if (!user) redirect("/auth/login")

  return <DashboardShell user={user}>{children}</DashboardShell>
}
