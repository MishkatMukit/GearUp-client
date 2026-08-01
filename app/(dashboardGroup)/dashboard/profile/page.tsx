import { redirect } from "next/navigation"
import { getMe } from "@/service/auth"
import { ProfileSection } from "@/app/(dashboardGroup)/_components/ProfileSection"

export default async function ProfilePage() {
  const user = await getMe()

  if (!user) redirect("/auth/login")

  return (
    <div className="mx-auto max-w-2xl">
      <ProfileSection user={user} />
    </div>
  )
}
