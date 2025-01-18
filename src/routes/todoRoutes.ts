import express from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { todoZodSchema } from "../models/todoSchema.js";
import { protect } from "../middlewares/authMiddleware.js";

const todoRouter = express.Router();

todoRouter.use(protect);

todoRouter
  .route("/")
  .post(validateRequest(todoZodSchema), createTodo)
  .get(getTodos);

todoRouter
  .route("/:id")
  .get(getTodo)
  .patch(validateRequest(todoZodSchema.partial()), updateTodo)
  .delete(deleteTodo);

export default todoRouter;
