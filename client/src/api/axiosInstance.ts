import axios from "axios";
import { toast } from "sonner";
import { queryClient } from "../lib/queryClient";
import { ErrorResponse } from "@/types/ResponseTypes";
import { PUBLIC_ROUTES } from "@/constants/routes";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isInitialAuthCheck =
      error.config?.headers?.["X-Initial-Auth-Check"] === "true";
    const currentPath = window.location.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    if (error.response?.status === 401) {
      const errorData = error.response.data as ErrorResponse;
      queryClient.clear();

      if (!isPublicRoute) {
        if (!isInitialAuthCheck) {
          toast.error(
            errorData.message || "Session expired. Please log in again."
          );
        }
        window.location.href = "/login";
      }
      return Promise.reject(errorData);
    }

    // Handle other errors as before
    if (error.response?.data && !isInitialAuthCheck) {
      const errorData = error.response.data as ErrorResponse;
      if (errorData.validationErrors) {
        Object.values(errorData.validationErrors).forEach((error) => {
          toast.error(error);
        });
      } else {
        toast.error(errorData.message || "An error occurred");
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
