import { create } from "zustand"

type ProfileFormState = {
  editing: boolean
  photoUrl: string
  uploading: boolean
  uploadError: string
  setEditing: (editing: boolean) => void
  setPhotoUrl: (url: string) => void
  setUploading: (uploading: boolean) => void
  setUploadError: (error: string) => void
  startEditing: (photoUrl: string) => void
  stopEditing: () => void
}

export const useProfileFormStore = create<ProfileFormState>((set) => ({
  editing: false,
  photoUrl: "",
  uploading: false,
  uploadError: "",
  setEditing: (editing) => set({ editing }),
  setPhotoUrl: (photoUrl) => set({ photoUrl }),
  setUploading: (uploading) => set({ uploading }),
  setUploadError: (uploadError) => set({ uploadError }),
  startEditing: (photoUrl) => set({ editing: true, photoUrl, uploadError: "" }),
  stopEditing: () => set({ editing: false, uploadError: "" }),
}))
