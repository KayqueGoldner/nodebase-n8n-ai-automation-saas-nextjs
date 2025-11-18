import { AppHeader } from "@/components/app-header";

interface RestLayoutProps {
  children: React.ReactNode;
}

const RestLayout = async ({ children }: RestLayoutProps) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
    </>
  )
}

export default RestLayout;
