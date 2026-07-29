import { Navbar } from "@/components/shared/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">GearUp</h1>
            <p className="text-muted-foreground text-sm">Rent Quality Gear, On Demand</p>
          </div> */}
          {children}
        </div>
      </div>
    </div>
  );
}
