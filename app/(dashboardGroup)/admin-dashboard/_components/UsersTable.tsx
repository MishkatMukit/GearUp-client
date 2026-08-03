import { SearchX, Users } from "lucide-react"
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
import type { AdminUserListResult } from "@/service/admin"
import { formatDate } from "@/lib/format"
import { normalizeImageUrl } from "@/lib/utils"
import { UserStatusButton } from "@/app/(dashboardGroup)/admin-dashboard/_components/UserStatusButton"
import { Pagination } from "@/components/ui/pagination"

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

type UsersTableProps = AdminUserListResult & {
  searchTerm?: string
}

export function UsersTable({ items, meta, searchTerm }: UsersTableProps) {
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("searchTerm", searchTerm)
    if (targetPage > 1) params.set("page", String(targetPage))
    const qs = params.toString()
    return qs ? `/admin-dashboard/users?${qs}` : "/admin-dashboard/users"
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-4 py-16 text-center">
        {searchTerm ? (
          <>
            <SearchX className="size-10 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold">No users found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No results for &ldquo;{searchTerm}&rdquo;. Try a different search term.
            </p>
          </>
        ) : (
          <>
            <Users className="size-10 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold">No users yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Registered customers and providers will appear here.
            </p>
          </>
        )}
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit))
  const from = (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.page * meta.limit, meta.total)

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}&ndash;{to}</span> of{" "}
        <span className="font-medium text-foreground">{meta.total}</span> users
      </p>
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
          {items.map((user) => (
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
      <Pagination page={meta.page} totalPages={totalPages} buildUrl={buildPageUrl} />
    </div>
  )
}

export function UsersTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="p-4">
        <div className="mb-4 h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="space-y-0">
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
    </div>
  )
}
