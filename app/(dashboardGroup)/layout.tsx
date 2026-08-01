import { redirect } from "next/navigation"
import { getMe } from "@/service/auth"
import { Navbar } from "@/components/shared/Navbar"
import { UserProvider } from "@/components/providers/UserProvider"
import { DashboardShell } from "@/app/(dashboardGroup)/_components/DashboardShell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMe()

  if (!user) redirect("/auth/login")

  return (
    <UserProvider user={user}>
      <div className="pt-16">
        <Navbar user={user} />
        <DashboardShell user={user}>{children}</DashboardShell>
      </div>
    </UserProvider>
  )
}
