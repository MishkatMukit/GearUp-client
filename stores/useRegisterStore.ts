import { create } from "zustand"

type RegisterState = {
  role: "CUSTOMER" | "PROVIDER"
  setRole: (role: "CUSTOMER" | "PROVIDER") => void
}

export const useRegisterStore = create<RegisterState>((set) => ({
  role: "CUSTOMER",
  setRole: (role) => set({ role }),
}))
