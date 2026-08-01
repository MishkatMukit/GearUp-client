import { Mail, MapPin } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { ApiGearDetail } from "@/lib/types"

export function ProviderCard({ gear }: { gear: ApiGearDetail }) {
  const provider = gear.provider
  const initials = provider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  const joinedYear = new Date(provider.createdAt).getFullYear()

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="size-14">
          <AvatarImage src={provider.profile?.profilePhoto} alt={provider.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{provider.name}</p>
          <p className="text-xs text-muted-foreground">Provider since {joinedYear}</p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {provider.email && (
              <p className="flex items-center gap-1.5">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{provider.email}</span>
              </p>
            )}
            {provider.profile?.address && (
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{provider.profile.address}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
