"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/app/auth/_actions/logout"
import { cn } from "@/lib/utils"
import type { User as UserType } from "@/service/auth"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Gears" },
]

type NavbarProps = {
  user?: UserType | null
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">GearUp</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none" aria-label="User menu">
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
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="size-4" />
                    Profile
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
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t md:hidden transition-all duration-200",
          isOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Profile
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
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
