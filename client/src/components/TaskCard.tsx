import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, Tag, Trash2, Edit3 } from "lucide-react";
import { Task } from "@/types/Task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void; // Add onEdit prop
  onDelete: (taskId: string) => void; // Add onDelete prop
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }
    return parsedDate.toLocaleDateString();
  };

  return (
    <Card className="task-card">
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`font-semibold text-lg ${
            task.status === "completed" ? "line-through" : ""
          }`}
        >
          {task.title}
        </h3>
        <Badge className={getPriorityColor(task.priority) + "ml-2"}>
          {task.priority}
        </Badge>
      </div>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <CalendarDays className="w-4 h-4" />
        <span>{formatDate(task.createdAt)}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {task.tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </div>
        ))}
      </div>
      <div className="flex gap-2 w-full justify-end">
        <button onClick={() => onEdit(task)} className="text-blue-500">
          <Edit3 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(task._id)} className="text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
