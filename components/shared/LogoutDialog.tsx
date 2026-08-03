"use client"

import { useState } from "react"
import { useActionState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { logoutAction } from "@/app/auth/_actions/logout"

export function LogoutDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [, formAction, pending] = useActionState(logoutAction, undefined)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={className ?? "h-full w-full justify-start text-destructive hover:text-destructive"}
        >
          <LogOut className="size-4" />
          Log Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log out of GearUp?</DialogTitle>
          <DialogDescription>
            You will be signed out and returned to the login page.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Logging out..." : "Log Out"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}