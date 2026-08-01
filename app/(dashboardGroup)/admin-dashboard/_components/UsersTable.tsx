import { Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ApiUser } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { normalizeImageUrl } from "@/lib/utils"
import { UserStatusButton } from "@/app/(dashboardGroup)/admin-dashboard/_components/UserStatusButton"

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

export function UsersTable({ users }: { users: ApiUser[] }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        <Users className="size-10 text-muted-foreground" />
        <h3 className="mt-4 text-base font-semibold">No users yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Registered customers and providers will appear here.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage
                    src={normalizeImageUrl(user.profile?.profilePhoto)}
                    alt={user.name}
                  />
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="max-w-56 truncate font-medium">{user.name}</p>
                  <p className="max-w-56 truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              {user.status === "ACTIVE" ? (
                <Badge variant="green">ACTIVE</Badge>
              ) : (
                <Badge variant="red">SUSPENDED</Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <UserStatusButton user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function UsersTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="space-y-0 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b py-3 last:border-0">
            <div className="size-9 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
