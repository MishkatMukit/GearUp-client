export const getNewAccessToken = async (
  refreshToken: string,
): Promise<
  | { success: true; data: { accessToken: string } }
  | { success: false; message: string }
> => {
  if (!refreshToken) {
    return { success: false, message: "No refresh token" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    })

    const result = await res.json()

    if (res.ok && result.success && result.data?.accessToken) {
      return { success: true, data: { accessToken: result.data.accessToken } }
    }

    return { success: false, message: result.message ?? "Failed to refresh token" }
  } catch {
    return { success: false, message: "Failed to refresh token" }
  }
}
