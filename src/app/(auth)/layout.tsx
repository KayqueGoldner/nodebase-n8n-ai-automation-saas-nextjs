import { AuthLayout } from "@/features/auth/components/auth-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}

export default Layout;