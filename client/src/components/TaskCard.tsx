import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, Tag } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/types/Task";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  return (
    <Card className="task-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <Badge className={getPriorityClass(task.priority)}>
          {task.priority}
        </Badge>
      </div>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <CalendarDays className="w-4 h-4" />
        <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
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
