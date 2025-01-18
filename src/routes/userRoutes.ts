import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { userLoginZodSchema, userZodSchema } from "../models/userSchema.js";

const userRouter = express.Router();

userRouter.post("/register", validateRequest(userZodSchema), createUser);
userRouter.post("/login", validateRequest(userLoginZodSchema), loginUser);

export default userRouter;
