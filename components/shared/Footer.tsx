import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">GearUp</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/gear" className="hover:text-foreground transition-colors">
              Browse Gear
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Log In
            </Link>
            <Link href="/auth/register" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GearUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
