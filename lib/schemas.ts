import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const createRentalSchema = z.object({
  gearItemId: z.string().min(1, "Gear is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
})

export type CreateRentalFormData = z.infer<typeof createRentalSchema>
