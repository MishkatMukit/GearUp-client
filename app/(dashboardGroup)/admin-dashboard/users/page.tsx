import { Suspense } from "react"
import { getAdminUsers } from "@/service/admin"
import { Card, CardContent } from "@/components/ui/card"
import { UsersTable, UsersTableSkeleton } from "@/app/(dashboardGroup)/admin-dashboard/_components/UsersTable"

async function UsersList() {
  const users = await getAdminUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage platform accounts and access.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersList />
    </Suspense>
  )
}
