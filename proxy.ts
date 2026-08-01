import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { JwtPayload } from "jsonwebtoken"
import { getNewAccessToken } from "./service/refreshToken"
import { jwtUtils } from "./utils/jwt"

const AUTH_ROUTES = ["/auth/login", "/auth/register"]
const PUBLIC_ROUTES = ["/", "/gear", "/not-found", "/payment/success", "/payment/cancel"]

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const response = NextResponse.next()

  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  let decodedAccessToken = accessToken ? jwtUtils.decodeToken(accessToken) : null
  const decodedRefreshToken = refreshToken ? jwtUtils.decodeToken(refreshToken) : null

  let currentAccessToken = accessToken

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken(refreshToken ?? "")

    if (result.success) {
      currentAccessToken = result.data.accessToken
      response.cookies.set("accessToken", currentAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      })
      decodedAccessToken = jwtUtils.decodeToken(currentAccessToken)
    }
  }

  let userRole: string | null = null

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role ?? null
  }

  const redirectWithCookies = (url: string) => {
    const redirectResponse = NextResponse.redirect(new URL(url, request.url))
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie))
    return redirectResponse
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  )
  const isAuthRoute = AUTH_ROUTES.includes(pathname)

  if (currentAccessToken && isAuthRoute) {
    if (userRole === "ADMIN") {
      return redirectWithCookies("/admin-dashboard")
    }
    return redirectWithCookies("/dashboard")
  }

  if (!currentAccessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (
    pathname.startsWith("/dashboard") &&
    userRole !== "CUSTOMER" &&
    userRole !== "PROVIDER"
  ) {
    return redirectWithCookies("/not-found")
  }

  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return redirectWithCookies("/not-found")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
}
