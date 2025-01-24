import { RequestHandler } from "express";
import { Todo, TodoType } from "../models/todoSchema.js";
import { ValidatedRequest } from "../types/express.js";
import { catchAsync } from "../utils/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";
import { Request, Response } from "express";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, user } = req.body;
    const newTodo = new Todo({
      title,
      description,
      user,
    });
    await newTodo.save();
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create todo" });
  }
};

export const getTodos: RequestHandler = catchAsync(async (req, res) => {
  if (req.user.role === "admin") {
    const todos = await Todo.find({});
    return sendResponse(res, 200, { success: true, data: todos });
  }
  const todos = await Todo.find({ user: req.user._id });
  return sendResponse(res, 200, { success: true, data: todos });
});

export const getTodo: RequestHandler = catchAsync(async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!todo) {
    return sendResponse(res, 404, {
      success: false,
      message: "Todo not found",
    });
  }

  return sendResponse(res, 200, { success: true, data: todo });
});

export const updateTodo: RequestHandler = catchAsync(async (req, res) => {
  const todoData: Partial<TodoType> = (req as ValidatedRequest).validatedData
    ?.body;

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    todoData,
    { new: true, runValidators: true }
  );

  if (!todo) {
    return sendResponse(res, 404, {
      success: false,
      message: "Todo not found",
    });
  }

  return sendResponse(res, 200, { success: true, data: todo });
});

export const deleteTodo: RequestHandler = catchAsync(async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!todo) {
    return sendResponse(res, 404, {
      success: false,
      message: "Todo not found",
    });
  }

  return sendResponse(res, 200, {
    success: true,
    message: "Todo deleted successfully",
  });
});
