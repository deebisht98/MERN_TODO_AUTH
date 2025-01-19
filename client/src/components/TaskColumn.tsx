import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: any[];
  status: string;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
}

export const TaskColumn = ({
  title,
  tasks,
  status,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskColumnProps) => {
  return (
    <div
      className={`column status-${status.toLowerCase().replace(" ", "-")}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="column-header">
        <span>{title}</span>
        <span className="bg-primary/20 text-primary text-sm px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};