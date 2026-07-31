import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { getMe } from "@/service/auth"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMe()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} transparent />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
