import jwt, { type JwtPayload } from "jsonwebtoken"

type TokenResult =
  | { success: true; data: JwtPayload }
  | { success: false; message: string }

export const jwtUtils = {
  decodeToken: (token: string): TokenResult => {
    try {
      const decoded = jwt.decode(token)

      if (!decoded || typeof decoded === "string") {
        return { success: false, message: "Invalid token" }
      }

      const now = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < now) {
        return { success: false, message: "Token expired" }
      }

      return { success: true, data: decoded }
    } catch {
      return { success: false, message: "Invalid token" }
    }
  },
}
