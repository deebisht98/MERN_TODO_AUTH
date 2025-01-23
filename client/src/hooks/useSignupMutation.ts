import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerUser } from "@/api/authApi";
import { useAuth } from "../context/AuthContext";
import { LoginResponse } from "../types/User";
import { useNavigate } from "@tanstack/react-router";

export const useSignupMutation = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationFn: registerUser,
      onSuccess: (data) => {
        setUser({
          _id: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.name,
          avatar: data.data.user.avatar,
          preferences: data.data.user.preferences,
          token: data.data.token,
        });
        toast.success("Your account has been created successfully!");
        navigate({ to: "/tasks" });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create account");
      },
    } as UseMutationOptions<
      LoginResponse,
      Error,
      { email: string; password: string }
    >
  );
};
