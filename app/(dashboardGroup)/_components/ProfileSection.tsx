"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Pencil, Mail, Phone, MapPin, X, Camera, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { updateProfileAction } from "@/app/(dashboardGroup)/_actions/updateProfile"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { useUserStore } from "@/stores/useUserStore"
import { useProfileFormStore } from "@/stores/useProfileFormStore"
import { cn, normalizeImageUrl } from "@/lib/utils"
import type { User } from "@/service/auth"

type ProfileSectionProps = {
  user: User
}

export function ProfileSection({ user: serverUser }: ProfileSectionProps) {
  const user = useUserStore((s) => s.user)
  const currentUser = user ?? serverUser
  const setUser = useUserStore((s) => s.setUser)
  const editing = useProfileFormStore((s) => s.editing)
  const photoUrl = useProfileFormStore((s) => s.photoUrl)
  const uploading = useProfileFormStore((s) => s.uploading)
  const uploadError = useProfileFormStore((s) => s.uploadError)
  const setPhotoUrl = useProfileFormStore((s) => s.setPhotoUrl)
  const setUploading = useProfileFormStore((s) => s.setUploading)
  const setUploadError = useProfileFormStore((s) => s.setUploadError)
  const startEditing = useProfileFormStore((s) => s.startEditing)
  const stopEditing = useProfileFormStore((s) => s.stopEditing)
  const router = useRouter()

  const [state, formAction, pending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      if (state.user) setUser(state.user)
      const timer = window.setTimeout(() => stopEditing(), 0)
      router.refresh()
      return () => window.clearTimeout(timer)
    }

    toast.error(state.message)
  }, [state, router, stopEditing, setUser])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB")
      return
    }

    setUploading(true)
    setUploadError("")

    try {
      const url = await uploadImageToCloudinary(file)
      setPhotoUrl(url)
    } catch {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const previewSrc = normalizeImageUrl(photoUrl)

  const joinedYear = currentUser.createdAt
    ? new Date(currentUser.createdAt).getFullYear()
    : null

  const infoItems = [
    { icon: Mail, label: "Email", value: currentUser.email },
    { icon: Phone, label: "Phone", value: currentUser.phone || "—" },
    { icon: MapPin, label: "Address", value: currentUser.profile?.address || "—" },
  ]

  if (editing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <button
              onClick={() => stopEditing()}
              aria-label="Cancel editing"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>

          <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" defaultValue={currentUser.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +880 555 000 1234"
                defaultValue={currentUser.phone ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Profile photo</Label>
              <div className="flex items-center gap-4">
                <div className="relative size-20 overflow-hidden rounded-full border bg-muted">
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt="Profile preview"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                      {initials}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                      uploading
                        ? "pointer-events-none cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:bg-muted",
                    )}
                  >
                    {uploading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Camera className="size-4" />
                    )}
                    {uploading ? "Uploading..." : photoUrl ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                  {uploadError && (
                    <p className="mt-1 text-xs text-destructive">{uploadError}</p>
                  )}
                </div>
              </div>
              <input type="hidden" name="profilePhoto" value={photoUrl} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="state your interests"
                defaultValue={currentUser.profile?.bio ?? ""}
                className="flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="City, area"
                defaultValue={currentUser.profile?.address ?? ""}
              />
            </div>

            {!state.success && state.message && (
              <p className="text-xs text-destructive">{state.message}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={pending || uploading}>
                {pending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => stopEditing()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={normalizeImageUrl(currentUser.profile?.profilePhoto)} alt={currentUser.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {currentUser.role}
              </span>
              <h2 className="text-lg font-semibold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              
              {joinedYear && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Member since {joinedYear}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => startEditing(currentUser.profile?.profilePhoto ?? "")}
            className="shrink-0"
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        </div>

        <div className="mt-6 space-y-3 border-t pt-6">
          {infoItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="w-20 text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            )
          })}
          {currentUser.profile?.bio && (
            <p className="pt-2 text-sm leading-7 text-muted-foreground">{currentUser.profile.bio}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
