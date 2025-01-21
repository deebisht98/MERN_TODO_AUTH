import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/api/taskApi";

export const useFetchTasks = () => {
  return useQuery({ queryKey: ["tasks"], queryFn: fetchTodos });
};
