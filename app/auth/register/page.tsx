"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { registerSchema, type RegisterFormData } from "@/lib/schemas"

export default function RegisterPage() {
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  })

  const selectRole = (r: "CUSTOMER" | "PROVIDER") => {
    setRole(r)
    setValue("role", r, { shouldValidate: true })
  }

  const onSubmit = (data: RegisterFormData) => {
    // no-op — functionality not implemented yet
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <h2 className="text-lg font-semibold">Create an account</h2>
        <p className="text-sm text-muted-foreground">Choose your role to get started</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>I want to</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectRole("CUSTOMER")}
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
                onClick={() => selectRole("PROVIDER")}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  role === "PROVIDER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                List Gear
              </button>
            </div>
            <input type="hidden" {...register("role")} />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
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
