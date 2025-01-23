import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSettings } from "@/api/userApi";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      // Invalidate user settings query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
};
