const uploadToCloudinary = async (file: File, preset: string | undefined): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName || !preset) {
    throw new Error("Cloudinary is not configured")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", preset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Image upload failed")
  }

  const data = await res.json()

  return data.secure_url as string
}

export const uploadImageToCloudinary = (file: File) =>
  uploadToCloudinary(file, process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

export const uploadGearImageToCloudinary = (file: File) =>
  uploadToCloudinary(file, process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_GEARS)
