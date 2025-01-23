import axiosInstance from "./axiosInstance";
import { ErrorResponse, SuccessResponse } from "@/types/ResponseTypes";

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<SuccessResponse> => {
  const response = await axiosInstance.post<SuccessResponse | ErrorResponse>(
    "/auth/login",
    data
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to log in");
  }
  return response.data;
};

export const registerUser = async (data: {
  email: string;
  password: string;
}): Promise<SuccessResponse> => {
  const response = await axiosInstance.post<SuccessResponse | ErrorResponse>(
    "/auth/register",
    data
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create account");
  }
  return response.data;
};

export const checkAuth = async (): Promise<SuccessResponse> => {
  const response = await axiosInstance.get<SuccessResponse | ErrorResponse>(
    "/auth/check",
    {
      headers: {
        "X-Initial-Auth-Check": "true", // Add this header for initial auth check
      },
    }
  );
  if (!response.data.success) {
    throw response.data; // Throw the entire error response
  }
  return response.data;
};

export const logoutUser = async (
  logoutAll: boolean = false
): Promise<SuccessResponse> => {
  const response = await axiosInstance.post<SuccessResponse | ErrorResponse>(
    "/auth/logout",
    { allDevices: logoutAll }
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to logout");
  }
  return response.data;
};
