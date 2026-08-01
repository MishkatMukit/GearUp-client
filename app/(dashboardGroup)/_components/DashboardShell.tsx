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
  UserRound,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear", label: "My Gear", icon: Boxes },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ClipboardList },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
  ADMIN: [
    { href: "/admin-dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin-dashboard/users", label: "Users", icon: Users },
    { href: "/admin-dashboard/gear", label: "Gear", icon: Boxes },
    { href: "/admin-dashboard/rentals", label: "Rentals", icon: Receipt },
    { href: "/admin-dashboard/profile", label: "Profile", icon: UserRound },
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

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-4">
      <span  className="mb-4 flex items-center gap-2 px-2">
        <span className="text-xl font-bold tracking-tight">Dashboard</span>
      </span>
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
      <aside className="fixed top-16 bottom-0 left-0 z-40 hidden w-64 border-r bg-card lg:block">
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
        <header className="sticky top-16 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
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
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
