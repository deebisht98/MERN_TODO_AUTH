import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "@/api/authApi";
import { SuccessResponse, ErrorResponse } from "@/types/ResponseTypes";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { useLocation } from "@tanstack/react-router";

export const useCheckAuth = () => {
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  return useQuery<SuccessResponse, ErrorResponse>({
    queryKey: ["check-auth"],
    queryFn: checkAuth,
    enabled: !isPublicRoute, // Only run query if not on public route
    retry: (failureCount, error) => {
      if (error.success === false) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
