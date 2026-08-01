"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { registerAction } from "@/app/auth/_actions/register"
import { useRegisterStore } from "@/stores/useRegisterStore"
import { toast } from "sonner"

export default function RegisterPage() {
  const role = useRegisterStore((s) => s.role)
  const setRole = useRegisterStore((s) => s.setRole)
  const [state, formAction, pending] = useActionState(
    registerAction,
    { success: false, statusCode: 0, message: "" },
  )

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <Card>
      <CardHeader className="text-center">
        <h2 className="text-lg font-semibold">Create an account</h2>
        <p className="text-sm text-muted-foreground">Choose your role to get started</p>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>I want to</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setRole("CUSTOMER"); }
                }
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  role === "CUSTOMER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                Rent Gear
              </button>
              <button
                type="button"
                onClick={() => { setRole("PROVIDER"); }
                }
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  role === "PROVIDER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                List Gear
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          {!state.success && state.message && (
            <p className="text-xs text-destructive">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
