import { ErrorResponse, SuccessResponse } from "@/types/ResponseTypes";
import axiosInstance from "./axiosInstance";
export type UserSettings = {
  name: string;
  bio?: string;
  location?: string | null;
  website?: string | null;
  socialLinks: {
    twitter?: string | null;
    linkedin?: string | null;
    github?: string | null;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: "all" | "important" | "none";
    language: "en" | "es" | "fr" | "de" | "zh";
  };
};

export const updateUserSettings = async (
  settings: UserSettings
): Promise<SuccessResponse> => {
  const response = await axiosInstance.patch<SuccessResponse | ErrorResponse>(
    "/users/settings",
    settings
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update user settings");
  }

  return response.data;
};

export const deleteUser = async (): Promise<SuccessResponse> => {
  const response = await axiosInstance.delete<SuccessResponse | ErrorResponse>(
    "/users/deleteAccount"
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete user");
  }
  return response.data;
};
