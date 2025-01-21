import express from "express";
import { createUser, loginUser } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { userLoginZodSchema, userZodSchema } from "../models/userSchema.js";
const authRouter = express.Router();

authRouter.post("/register", validateRequest(userZodSchema), createUser);
authRouter.post("/login", validateRequest(userLoginZodSchema), loginUser);

export default authRouter;
