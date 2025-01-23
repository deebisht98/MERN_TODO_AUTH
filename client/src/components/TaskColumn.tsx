import { TaskCard } from "./TaskCard";
import { Task, TaskStatus } from "@/types/Task";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  className?: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
}

export const TaskColumn = ({
  title,
  tasks,
  status,
  onDragStart,
  onDragOver,
  onDrop,
  className,
}: TaskColumnProps) => {
  return (
    <div
      className={`p-4 rounded-lg ${className}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold capitalize">{title}</h2>
        <span className="bg-primary/20 text-primary text-sm px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            draggable
            onDragStart={(e) => onDragStart(e, task._id)}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};
