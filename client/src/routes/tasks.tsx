import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchTasks } from "@/hooks/useFetchTasks";
import { useUpdateTaskStatus } from "@/hooks/useUpdateTaskStatus";
import { TaskColumn } from "@/components/TaskColumn";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";
import { Task, TaskStatus } from "@/types/Task";

export const Route = createFileRoute("/tasks")({
  component: Tasks,
});

function Tasks() {
  const { data, refetch } = useFetchTasks();
  const tasks = (data?.data as Task[]) ?? [];
  const updateTaskStatus = useUpdateTaskStatus();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    setDraggedTaskId(taskId);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    status: TaskStatus
  ) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    try {
      await updateTaskStatus.mutateAsync({
        taskId: draggedTaskId,
        status,
      });
      refetch();
      toast.success(`Task moved to ${status}`);
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setDraggedTaskId(null);
      const draggingElement = document.querySelector(".dragging");
      if (draggingElement) {
        draggingElement.classList.remove("dragging");
      }
    }
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <NavBar />

      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Task Board
            </h1>
            {/* Add task button here if needed */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["pending", "in-progress", "completed"] as const).map(
              (status) => (
                <div
                  key={status}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <TaskColumn
                    title={status}
                    tasks={getTasksByStatus(status)}
                    status={status}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
