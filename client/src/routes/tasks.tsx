import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TaskColumn } from "@/components/TaskColumn";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";

// Mock data - replace with your actual data fetching logic
const mockTasks = [
  {
    id: "1",
    title: "Implement Authentication",
    description: "Add user authentication using JWT tokens",
    status: "Pending",
    priority: "High",
    dueDate: "2024-03-20",
    tags: ["Backend", "Security"],
  },
  {
    id: "2",
    title: "Design Homepage",
    description: "Create responsive design for the homepage",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2024-03-15",
    tags: ["Frontend", "UI/UX"],
  },
  {
    id: "3",
    title: "Database Optimization",
    description: "Optimize database queries for better performance",
    status: "Completed",
    priority: "Low",
    dueDate: "2024-03-10",
    tags: ["Database", "Performance"],
  },
];

export const Route = createFileRoute("/tasks")({
  component: Tasks,
});

function Tasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggedTaskId) {
        return { ...task, status };
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTaskId(null);
    document.querySelector(".dragging")?.classList.remove("dragging");
    toast.success(`Task moved to ${status}`);
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <NavBar />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Board</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="Pending"
              tasks={getTasksByStatus("Pending")}
              status="Pending"
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            <TaskColumn
              title="In Progress"
              tasks={getTasksByStatus("In Progress")}
              status="In Progress"
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
            <TaskColumn
              title="Completed"
              tasks={getTasksByStatus("Completed")}
              status="Completed"
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
