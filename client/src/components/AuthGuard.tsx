import { useAuthGuard } from "@/hooks/useAuthGuard";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
}

export const AuthGuard = ({
  children,
  redirectAuthenticated = false,
}: AuthGuardProps) => {
  const { isLoading } = useAuthGuard(redirectAuthenticated);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};
