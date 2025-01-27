import { queryOptions } from "@tanstack/react-query";
import { fetchTodos } from "@/api/taskApi";

export const tasksQueryOptions = queryOptions({
  queryKey: ["tasks"],
  queryFn: fetchTodos,
});
