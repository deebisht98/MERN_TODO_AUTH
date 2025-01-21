import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser } from "@/api/authApi";
import { useAuth } from "../context/AuthContext";
import { LoginResponse } from "../types/User";

export const useLoginMutation = () => {
  const { setUser } = useAuth();

  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationFn: loginUser,
      onSuccess: (data) => {
        setUser({
          _id: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.name,
          avatar: data.data.user.avatar,
          preferences: data.data.user.preferences,
          token: data.data.token,
        });
        toast.success("Logged in successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to log in");
      },
    } as UseMutationOptions<
      LoginResponse,
      Error,
      { email: string; password: string }
    >
  );
};
