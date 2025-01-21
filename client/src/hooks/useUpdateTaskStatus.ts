import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTodoStatus } from "@/api/taskApi";
import { Task } from "@/types/Task";

export const useUpdateTaskStatus = () => {
  return useMutation<Task, Error, { taskId: string; status: string }>({
    mutationFn: ({ taskId, status }) => updateTodoStatus(taskId, status),
    onSuccess: () => {
      toast.success("Task status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task status");
    },
  } as UseMutationOptions<Task, Error, { taskId: string; status: string }>);
};
