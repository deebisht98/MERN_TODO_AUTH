import axios, { AxiosResponse } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginResponse, User } from "../types/User";

type LoginFn = (data: User) => void;

export const useSignupMutation = (loginFn: LoginFn) => {
  return useMutation<
    AxiosResponse<LoginResponse>,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationFn: (data: { name: string; email: string; password: string }) => {
      return axios.post("http://localhost:8080/v1/users/register", data);
    },
    onSuccess: ({ data }) => {
      loginFn({
        _id: data.data.user._id,
        email: data.data.user.email,
        name: data.data.user.name,
        avatar: data.data.user.avatar,
        preferences: data.data.user.preferences,
        token: data.data.token,
      });
      toast.success("Your account has been created successfully!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to create account");
      } else {
        toast.error("Failed to create account");
      }
    },
  } as UseMutationOptions<
    AxiosResponse<LoginResponse>,
    Error,
    { name: string; email: string; password: string }
  >);
};
