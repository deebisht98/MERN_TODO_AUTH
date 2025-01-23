import { ErrorResponse, SuccessResponse } from "@/types/ResponseTypes";
import axiosInstance from "./axiosInstance";

export const fetchTodos = async (): Promise<SuccessResponse> => {
  const response = await axiosInstance.get<SuccessResponse | ErrorResponse>(
    "/todos"
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch todos");
  }
  return response.data;
};

export const updateTodoStatus = async (
  taskId: string,
  status: string
): Promise<SuccessResponse> => {
  const response = await axiosInstance.patch<SuccessResponse | ErrorResponse>(
    `/todos/${taskId}`,
    { status }
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update todo status");
  }
  return response.data;
};
