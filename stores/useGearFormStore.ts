import { create } from "zustand"

type GearFormState = {
  photoUrl: string
  uploading: boolean
  uploadError: string
  setPhotoUrl: (url: string) => void
  setUploading: (uploading: boolean) => void
  setUploadError: (error: string) => void
  reset: () => void
}

export const useGearFormStore = create<GearFormState>((set) => ({
  photoUrl: "",
  uploading: false,
  uploadError: "",
  setPhotoUrl: (photoUrl) => set({ photoUrl }),
  setUploading: (uploading) => set({ uploading }),
  setUploadError: (uploadError) => set({ uploadError }),
  reset: () => set({ photoUrl: "", uploading: false, uploadError: "" }),
}))
