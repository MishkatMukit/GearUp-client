export type GearCardProps = {
  id: string
  name: string
  category: string
  brand: string
  pricePerDay: number
  image: string
  availability: boolean
}

import type { User } from "@/service/auth"

export type ApiGearItem = {
  id: string
  name: string
  brand?: string
  pricePerDay: number
  isAvailable: boolean
  images: string[]
  category: { id: string; name: string }
}

export type ApiCategory = {
  id: string
  name: string
  _count?: { gearItems: number }
}

export type ApiProviderGear = {
  id: string
  name: string
  description?: string
  brand?: string
  pricePerDay: number
  stock?: number
  isAvailable: boolean
  images: string[]
  category?: { id: string; name: string }
  createdAt?: string
}

export type ApiUser = {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  status: string
  createdAt: string
  updatedAt: string
  profile?: {
    id: string
    profilePhoto?: string
    bio?: string
    address?: string
    userId: string
  }
}

export type ApiReview = {
  id: string
  rating: number
  comment?: string
  customerId: string
  gearItemId: string
  createdAt: string
  updatedAt: string
  customer?: ApiUser
}

export type ApiGearDetail = {
  id: string
  name: string
  description: string
  brand?: string
  pricePerDay: number
  stock: number
  isAvailable: boolean
  images: string[]
  categoryId: string
  category: { id: string; name: string }
  providerId: string
  provider: ApiUser
  reviews?: ApiReview[]
  _count?: { reviews: number }
  createdAt: string
  updatedAt: string
}

export type RentalState = {
  success: boolean
  message: string
  data?: {
    id: string
    startDate: string
    endDate: string
    quantity: number
    days: number
    totalAmount: number
  }
}

export type ProfileState = {
  success: boolean
  message: string
  user?: User
}

export type MutationState = {
  success: boolean
  message: string
}

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN"

export type RentalStatus = "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED"

export type ApiPayment = {
  id: string
  transactionId: string
  rentalOrderId: string
  amount: number
  status: PaymentStatus
  stripeSessionId?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
  rentalOrder?: ApiRentalOrder
}

export type ApiRentalOrder = {
  id: string
  customerId: string
  gearItemId: string
  customer?: {
    id: string
    name: string
    email?: string
  }
  gearItem?: {
    id: string
    name: string
    brand?: string
    images: string[]
    category?: { id: string; name: string }
  }
  status: RentalStatus
  startDate: string
  endDate: string
  quantity: number
  days: number
  pricePerDay: number
  totalAmount: number
  payment?: ApiPayment | null
  createdAt: string
  updatedAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: "CUSTOMER" | "PROVIDER"
}

export type AuthResponse = {
  success: boolean
  statusCode: number
  message: string
  data?: {
    accessToken: string
    refreshToken: string
  }
}

export type LoginState = {
  success: boolean
  statusCode: number
  message: string
}

export type RegisterState = {
  success: boolean
  statusCode: number
  message: string
}
