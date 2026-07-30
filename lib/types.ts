export type GearCardProps = {
  id: string
  name: string
  category: string
  brand: string
  pricePerDay: number
  image: string
  availability: boolean
}

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

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN"

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
