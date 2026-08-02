"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useUserStore } from "@/stores/useUserStore"
import { useUiStore } from "@/stores/useUiStore"
import { LogoutDialog } from "@/components/shared/LogoutDialog"
import { cn, normalizeImageUrl } from "@/lib/utils"
import type { User as UserType } from "@/service/auth"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Gears" },
]

type NavbarProps = {
  user?: UserType | null
  transparent?: boolean
}

export function Navbar({ user: serverUser, transparent = false }: NavbarProps) {
  const user = useUserStore((s) => s.user)
  const currentUser = user ?? serverUser
  const isOpen = useUiStore((s) => s.mobileNavOpen)
  const scrolled = useUiStore((s) => s.scrolled)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const setScrolled = useUiStore((s) => s.setScrolled)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [setScrolled])

  const isHome = pathname === "/"
  const transparentMode = transparent && isHome
  const solid = !transparentMode || scrolled || isOpen
  const overDark = transparentMode && !solid

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const dashboardHref =
    currentUser?.role === "ADMIN"
      ? "/admin-dashboard"
      : currentUser?.role === "PROVIDER"
        ? "/dashboard/provider"
        : "/dashboard/customer"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b transition-colors",
        solid
          ? "border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className={cn("text-xl font-bold tracking-tight", overDark && "text-white")}>
            GearUp
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                overDark
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none" aria-label="User menu">
                  <Avatar className="size-8">
                    <AvatarImage src={normalizeImageUrl(currentUser.profile?.profilePhoto)} alt={currentUser.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{currentUser.name}</div>
                <div className="px-2 pb-1 text-xs text-muted-foreground">{currentUser.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref} className="cursor-pointer">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutDialog />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant={overDark ? "ghost" : "ghost"}
                size="sm"
                asChild
                className={overDark ? "text-white hover:bg-white/10 hover:text-white" : undefined}
              >
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className={overDark ? "bg-white text-slate-900 hover:bg-white/90" : undefined}
              >
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileNavOpen(!isOpen)}
          className="flex items-center md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className={cn("size-5", overDark && "text-white")} />
          )}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t md:hidden transition-all duration-200",
          solid ? "border-border" : "border-white/10",
          isOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileNavOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          {currentUser ? (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setMobileNavOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Dashboard
              </Link>
              <LogoutDialog className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted" />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMobileNavOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileNavOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
