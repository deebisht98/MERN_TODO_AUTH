import { z } from "zod";
import mongoose from "mongoose";

const todoValidation = {
  title: {
    required: true,
    min: 1,
    max: 100,
    messages: {
      required: "Title is required",
      min: "Title must be between 1 and 100 characters",
      max: "Title must be between 1 and 100 characters",
    },
  },
  description: {
    max: 500,
    messages: {
      required: "Description is required",
      max: "Description cannot exceed 500 characters",
    },
  },
  status: {
    required: true,
    enum: ["pending", "in-progress", "completed"] as const,
    default: "pending",
    messages: {
      required: "Status is required",
      invalid: "Status must be either 'pending', 'in-progress', or 'completed'",
    },
  },
  priority: {
    required: true,
    enum: ["low", "medium", "high"] as const,
    default: "medium",
    messages: {
      required: "Priority is required",
      invalid: "Priority must be either 'low', 'medium', or 'high'",
    },
  },
  dueDate: {
    messages: {
      required: "Due date is required",
      invalid: "Please provide a valid date",
    },
  },
  completed: {
    default: false,
    messages: {
      required: "Completed status is required",
    },
  },
  tags: {
    default: [] as string[],
    messages: {
      required: "Tags array is required",
    },
  },
  user: {
    required: true,
    messages: {
      required: "User ID is required",
    },
  },
} as const;

export const todoZodSchema = z.object({
  title: z
    .string({ required_error: todoValidation.title.messages.required })
    .min(todoValidation.title.min, {
      message: todoValidation.title.messages.min,
    })
    .max(todoValidation.title.max, {
      message: todoValidation.title.messages.max,
    }),
  description: z
    .string({ required_error: todoValidation.description.messages.required })
    .max(todoValidation.description.max, {
      message: todoValidation.description.messages.max,
    })
    .optional(),
  status: z
    .enum(todoValidation.status.enum, {
      required_error: todoValidation.status.messages.required,
      invalid_type_error: todoValidation.status.messages.invalid,
    })
    .default(todoValidation.status.default),
  priority: z
    .enum(todoValidation.priority.enum, {
      required_error: todoValidation.priority.messages.required,
      invalid_type_error: todoValidation.priority.messages.invalid,
    })
    .default(todoValidation.priority.default),
  dueDate: z
    .date({
      required_error: todoValidation.dueDate.messages.required,
      invalid_type_error: todoValidation.dueDate.messages.invalid,
    })
    .optional(),
  completed: z
    .boolean({ required_error: todoValidation.completed.messages.required })
    .default(todoValidation.completed.default),
  completedAt: z
    .date({ invalid_type_error: "Completed at must be a valid date" })
    .optional(),
  tags: z
    .array(z.string(), {
      required_error: todoValidation.tags.messages.required,
    })
    .default(todoValidation.tags.default),
  user: z.string({ required_error: todoValidation.user.messages.required }),
});

export const todoMongoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, todoValidation.title.messages.required],
      minlength: [todoValidation.title.min, todoValidation.title.messages.min],
      maxlength: [todoValidation.title.max, todoValidation.title.messages.max],
    },
    description: {
      type: String,
      maxlength: [
        todoValidation.description.max,
        todoValidation.description.messages.max,
      ],
    },
    status: {
      type: String,
      enum: todoValidation.status.enum,
      default: todoValidation.status.default,
    },
    priority: {
      type: String,
      enum: todoValidation.priority.enum,
      default: todoValidation.priority.default,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: todoValidation.completed.default,
    },
    completedAt: {
      type: Date,
    },
    tags: {
      type: [String],
      default: todoValidation.tags.default,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, todoValidation.user.messages.required],
    },
  },
  {
    timestamps: true,
  }
);

export interface ITodo extends mongoose.Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  tags: string[];
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Todo = mongoose.model<ITodo>("Todo", todoMongoSchema);

export type TodoType = z.infer<typeof todoZodSchema>;
