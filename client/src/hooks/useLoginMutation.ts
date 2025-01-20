import axios, { AxiosResponse } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginResponse, User } from "../types/User";

type LoginFn = (data: User) => void;

export const useLoginMutation = (loginFn: LoginFn) => {
  return useMutation<
    AxiosResponse<LoginResponse>,
    Error,
    { email: string; password: string }
  >({
    mutationFn: (data: { email: string; password: string }) => {
      return axios.post("http://localhost:8080/v1/users/login", data);
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
      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to log in");
      } else {
        toast.error("Failed to log in");
      }
    },
  } as UseMutationOptions<
    AxiosResponse<LoginResponse>,
    Error,
    { email: string; password: string }
  >);
};
