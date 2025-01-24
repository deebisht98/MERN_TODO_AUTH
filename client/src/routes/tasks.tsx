import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchTasks } from "@/hooks/useFetchTasks";
import { useUpdateTaskStatus } from "@/hooks/useUpdateTaskStatus";
import { TaskColumn } from "@/components/TaskColumn";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";
import { Task, TaskStatus } from "@/types/Task";
import { useCreateTodo } from "@/hooks/useCreateTodo";
import { TodoForm } from "@/components/TodoForm";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export const Route = createFileRoute("/tasks")({
  component: Tasks,
});

function Tasks() {
  const { data } = useFetchTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const updateTaskStatus = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const createTodoMutation = useCreateTodo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (data?.data) {
      setTasks(data.data as Task[]);
    }
  }, [data]);

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

    const draggedTask = tasks.find((task) => task._id === draggedTaskId);
    if (draggedTask?.status === status) {
      setDraggedTaskId(null);
      const draggingElement = document.querySelector(".dragging");
      if (draggingElement) {
        draggingElement.classList.remove("dragging");
      }
      return;
    }

    try {
      const updatedTask = await updateTaskStatus.mutateAsync({
        taskId: draggedTaskId,
        status,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === draggedTaskId ? updatedTask : task
        )
      );
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

  const handleFormSubmit = async (data: {
    title: string;
    description: string;
  }) => {
    if (selectedTask) {
      try {
        const updatedTask = await updateTaskStatus.mutateAsync({
          taskId: selectedTask._id,
          ...data,
        });
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === selectedTask._id ? updatedTask : task
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Failed to update task");
      }
    } else {
      createTodoMutation.mutate(data, {
        onSuccess: (newTask) => {
          setTasks((prevTasks) => [...prevTasks, newTask]);
          setIsModalOpen(false);
        },
        onError: () => {
          toast.error(
            selectedTask ? "Failed to update task" : "Failed to create task"
          );
        },
      });
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTodoClick = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskMutation.mutateAsync({ taskId: taskToDelete });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete)
      );
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <NavBar />

      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Task Board
            </h1>

            <button
              onClick={handleAddTodoClick}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Add Todo
            </button>
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
                    className={` backdrop-blur-sm shadow-lg rounded-lg border-0 ${
                      status === "pending"
                        ? "bg-red-100/50"
                        : status === "in-progress"
                          ? "bg-yellow-100/50"
                          : "bg-green-100/50"
                    }`}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <TodoForm
        key={selectedTask?._id || "create"}
        initialValues={
          selectedTask
            ? {
                title: selectedTask.title,
                description: selectedTask.description || "",
              }
            : undefined
        }
        onSubmit={handleFormSubmit}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
    </div>
  );
}
