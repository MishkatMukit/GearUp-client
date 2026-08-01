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

export const createGearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  brand: z.string().trim().optional(),
  pricePerDay: z.coerce.number().positive("Price per day must be greater than 0"),
  stock: z.coerce.number().int().nonnegative("Stock must be a positive integer"),
  isAvailable: z.boolean().optional(),
  images: z.array(z.string().url("Enter a valid image URL")).optional(),
  categoryId: z.string().min(1, "Category is required"),
})

export const updateGearSchema = createGearSchema.partial()

export type CreateGearFormData = z.infer<typeof createGearSchema>

export const updateRentalStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED"]),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(5, "Phone number must be at least 5 characters")
    .or(z.literal(""))
    .optional(),
  profilePhoto: z
    .string()
    .url("Enter a valid image URL")
    .or(z.literal(""))
    .optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  address: z.string().max(200, "Address must be under 200 characters").optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
