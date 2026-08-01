"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Camera, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  createGearAction,
  updateGearAction,
} from "@/app/(dashboardGroup)/dashboard/provider/_actions/gear"
import { uploadGearImageToCloudinary } from "@/lib/cloudinary"
import { useGearFormStore } from "@/stores/useGearFormStore"
import { cn, normalizeImageUrl } from "@/lib/utils"
import type { ApiCategory, ApiGearDetail } from "@/lib/types"

type GearFormProps = {
  categories: ApiCategory[]
  gear?: ApiGearDetail | null
}

export function GearForm({ categories, gear }: GearFormProps) {
  const router = useRouter()
  const photoUrl = useGearFormStore((s) => s.photoUrl)
  const uploading = useGearFormStore((s) => s.uploading)
  const uploadError = useGearFormStore((s) => s.uploadError)
  const setPhotoUrl = useGearFormStore((s) => s.setPhotoUrl)
  const setUploading = useGearFormStore((s) => s.setUploading)
  const setUploadError = useGearFormStore((s) => s.setUploadError)
  const reset = useGearFormStore((s) => s.reset)

  const action = gear ? updateGearAction : createGearAction
  const [state, formAction, pending] = useActionState(action, {
    success: false,
    message: "",
  })

  useEffect(() => {
    setPhotoUrl(gear?.images?.[0] ?? "")
    setUploadError("")
  }, [gear, setPhotoUrl, setUploadError])

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      reset()
      router.push("/dashboard/provider/gear")
      return
    }

    toast.error(state.message)
  }, [state, router, reset])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be under 2MB")
      return
    }

    setUploading(true)
    setUploadError("")

    try {
      const url = await uploadGearImageToCloudinary(file)
      setPhotoUrl(url)
    } catch {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const previewSrc = normalizeImageUrl(photoUrl)

  const selectClass =
    "flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-5">
          {gear && <input type="hidden" name="gearId" value={gear.id} />}
          <input type="hidden" name="photo" value={photoUrl} />

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={gear?.name ?? ""} required />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="e.g. Coleman" defaultValue={gear?.brand ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={gear?.categoryId ?? ""}
                className={selectClass}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe the gear, condition, and what's included."
              defaultValue={gear?.description ?? ""}
              className="flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per day</Label>
              <Input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min={0}
                step="0.01"
                defaultValue={gear?.pricePerDay ?? 0}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min={0}
                step={1}
                defaultValue={gear?.stock ?? 1}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <div className="relative size-20 overflow-hidden rounded-lg border bg-muted">
                {previewSrc ? (
                  <Image
                    src={previewSrc}
                    alt="Gear preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
                    No image
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
                {uploadError && <p className="mt-1 text-xs text-destructive">{uploadError}</p>}
              </div>
            </div>
          </div>

          <label className="flex w-fit items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="isAvailable"
              value="true"
              defaultChecked={gear?.isAvailable ?? true}
              className="size-4 rounded border-input accent-primary"
            />
            Available for rent
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={pending || uploading}>
              {pending ? "Saving..." : gear ? "Save Changes" : "Add Gear"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/provider/gear">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
