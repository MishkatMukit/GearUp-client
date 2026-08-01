import { redirect } from "next/navigation"
import { getMe } from "@/service/auth"
import { ProfileSection } from "@/app/(dashboardGroup)/_components/ProfileSection"

export default async function AdminProfilePage() {
  const user = await getMe()

  if (!user) redirect("/auth/login")

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and update your account information.
        </p>
      </div>
      <ProfileSection user={user} />
    </div>
  )
}
