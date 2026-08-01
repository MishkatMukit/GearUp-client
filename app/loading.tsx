import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-7 animate-spin text-primary" />

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Loading GearUp
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
}