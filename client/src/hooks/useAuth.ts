import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/api/authApi";
import { useNavigate } from "@tanstack/react-router";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
      navigate({ to: "/login" });
    },
  });
};
