import axiosInstance from "./axiosInstance";

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.post("/auth/login", data);
  if (!response.data.success) {
    throw new Error(response.data.errors || "Failed to log in");
  }
  return response.data;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/register", data);
  if (!response.data.success) {
    throw new Error(response.data.errors || "Failed to create account");
  }
  return response.data;
};

export const checkAuth = async () => {
  const response = await axiosInstance.get("/auth/check");
  if (!response.data.success) {
    throw new Error(response.data.errors || "Failed to check authentication");
  }
  return response.data;
};
