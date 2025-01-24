import { ErrorResponse, SuccessResponse } from "@/types/ResponseTypes";
import axiosInstance from "./axiosInstance";
import { Task } from "@/types/Task";

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
  data: Partial<Task>
): Promise<Task> => {
  const response = await axiosInstance.patch<SuccessResponse | ErrorResponse>(
    `/todos/${taskId}`,
    data
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update todo status");
  }
  return response.data.data as Task;
};

export const createTodo = async (data: {
  title: string;
  description: string;
}): Promise<Task> => {
  const response = await axiosInstance.post<SuccessResponse | ErrorResponse>(
    "/todos",
    data
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create todo");
  }
  return response.data.data as Task;
};
