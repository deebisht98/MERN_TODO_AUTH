import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser } from "@/api/authApi";
import { useAuth } from "../context/AuthContext";
import { LoginResponse } from "../types/User";
import { useNavigate } from "@tanstack/react-router";

export const useLoginMutation = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, { email: string; password: string }>(
    {
      mutationFn: loginUser,
      onSuccess: (data) => {
        setUser({
          _id: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.name,
          bio: data.data.user.bio,
          avatar: data.data.user.avatar,
          preferences: data.data.user.preferences,
          token: data.data.token,
          socialLinks: data.data.user.socialLinks,
          location: data.data.user.location,
        });
        toast.success("Logged in successfully!");
        navigate({ to: "/tasks" });
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
