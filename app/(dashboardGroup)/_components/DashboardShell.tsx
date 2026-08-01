"use client"

import { useState } from "react"
import type { ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Boxes,
  ClipboardList,
  Users,
  Receipt,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/auth/_actions/logout"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/service/auth"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: Package },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear", label: "My Gear", icon: Boxes },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ClipboardList },
  ],
  ADMIN: [
    { href: "/admin-dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin-dashboard/users", label: "Users", icon: Users },
    { href: "/admin-dashboard/gear", label: "Gear", icon: Boxes },
    { href: "/admin-dashboard/rentals", label: "Rentals", icon: Receipt },
  ],
}

type DashboardShellProps = {
  user: User
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = NAV_ITEMS[user.role] ?? []
  const activeItem = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  )
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-4">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2">
        <span className="text-xl font-bold tracking-tight">GearUp</span>
      </Link>
      {navItems.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:block">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r bg-card">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-md p-1 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-base font-semibold tracking-tight">
              {activeItem?.label ?? "Dashboard"}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full outline-none"
                aria-label="User menu"
              >
                <Avatar className="size-8">
                  <AvatarImage src={user.profile?.profilePhoto} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
              <div className="px-2 pb-1 text-xs text-muted-foreground">{user.email}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={logoutAction}>
                  <button type="submit" className="flex w-full items-center gap-2 text-destructive">
                    <LogOut className="size-4" />
                    Log Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
