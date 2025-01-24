import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/Task";
import axiosInstance from "@/api/axiosInstance";

const deleteTask = async ({ taskId }: { taskId: string }) => {
  const response = await axiosInstance.delete(`/todos/${taskId}`);
  return response.data;
};

export const useDeleteTask = () => {
  return useMutation<Task, Error, { taskId: string }>({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task");
    },
  } as UseMutationOptions<Task, Error, { taskId: string }>);
};
