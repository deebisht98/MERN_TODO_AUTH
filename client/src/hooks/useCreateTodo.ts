import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTodo } from "@/api/taskApi";
import { Task } from "@/types/Task";

export const useCreateTodo = () => {
  return useMutation<Task, Error, { title: string; description: string }>({
    mutationFn: createTodo,
    onSuccess: () => {
      toast.success("Todo created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create todo");
    },
  } as UseMutationOptions<Task, Error, { title: string; description: string }>);
};
