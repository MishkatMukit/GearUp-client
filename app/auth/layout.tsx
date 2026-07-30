import { Navbar } from "@/components/shared/Navbar";
import { getMe } from "@/service/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
