import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchTasks } from "@/hooks/useFetchTasks";
import { useUpdateTaskStatus } from "@/hooks/useUpdateTaskStatus";
import { TaskColumn } from "@/components/TaskColumn";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";
import { Task } from "@/types/Task";

export const Route = createFileRoute("/tasks")({
  component: Tasks,
});

function Tasks() {
  const { data: tasks = [], refetch } = useFetchTasks();
  const updateTaskStatus = useUpdateTaskStatus();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    try {
      await updateTaskStatus.mutateAsync({ taskId: draggedTaskId, status });
      refetch();
      toast.success(`Task moved to ${status}`);
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setDraggedTaskId(null);
      document.querySelector(".dragging")?.classList.remove("dragging");
    }
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task: Task) => task.status === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <NavBar />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Board</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="pending"
              tasks={getTasksByStatus("pending")}
              status="pending"
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            <TaskColumn
              title="in-progress"
              tasks={getTasksByStatus("in-progress")}
              status="in-progress"
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            <TaskColumn
              title="completed"
              tasks={getTasksByStatus("completed")}
              status="completed"
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
