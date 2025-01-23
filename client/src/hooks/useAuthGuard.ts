import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";

export const useAuthGuard = (redirectAuthenticated: boolean = false) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: checkAuth,
    retry: false,
    enabled:
      !isLoading &&
      ((redirectAuthenticated && !isAuthenticated) ||
        (!redirectAuthenticated && isAuthenticated)),
  });

  useEffect(() => {
    if (!isLoading) {
      if (redirectAuthenticated && isAuthenticated) {
        navigate({ to: "/tasks" });
      } else if (!redirectAuthenticated && !isAuthenticated) {
        navigate({ to: "/login" });
      }
    }
  }, [isAuthenticated, redirectAuthenticated, isLoading, navigate]);

  return {
    isLoading: isLoading || (!isLoading && data === undefined),
    isAuthenticated,
    error,
  };
};
