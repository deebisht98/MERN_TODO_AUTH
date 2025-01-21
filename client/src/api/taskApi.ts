import axiosInstance from "./axiosInstance";

export const fetchTodos = async () => {
  const response = await axiosInstance.get("/todos");
  if (!response.data.success) {
    throw new Error(response.data.errors || "Failed to fetch todos");
  }
  return response.data;
};

export const updateTodoStatus = async (taskId: string, status: string) => {
  const response = await axiosInstance.patch(`/todos/${taskId}`, { status });
  if (!response.data.success) {
    throw new Error(response.data.errors || "Failed to update todo status");
  }
  return response.data;
};
