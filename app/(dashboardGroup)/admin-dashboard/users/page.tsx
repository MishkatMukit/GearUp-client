import { Suspense } from "react"
import { getAdminUsersList } from "@/service/admin"
import { Card, CardContent } from "@/components/ui/card"
import { UsersTable, UsersTableSkeleton } from "@/app/(dashboardGroup)/admin-dashboard/_components/UsersTable"
import { UserSearchBar } from "@/app/(dashboardGroup)/admin-dashboard/_components/UserSearchBar"

export const dynamic = "force-dynamic"

type UsersPageProps = {
  searchParams: Promise<{
    searchTerm?: string
    page?: string
  }>
}

async function UsersTableAsync({ searchTerm, page }: { searchTerm?: string; page?: string }) {
  const result = await getAdminUsersList({ searchTerm, page, limit: "10" })
  return <UsersTable {...result} searchTerm={searchTerm} />
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage platform accounts and access.
        </p>
      </div>
      <UserSearchBar />
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<UsersTableSkeleton />} key={params.searchTerm ?? ""}>
            <UsersTableAsync searchTerm={params.searchTerm} page={params.page} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
