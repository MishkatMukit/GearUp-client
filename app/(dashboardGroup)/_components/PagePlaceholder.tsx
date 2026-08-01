import { Construction } from "lucide-react"

export function PagePlaceholder({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-4 py-24 text-center">
      <Construction className="size-10 text-muted-foreground" />
      <p className="mt-4 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
