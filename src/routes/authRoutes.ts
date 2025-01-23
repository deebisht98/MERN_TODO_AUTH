import express from "express";
import {
  checkAuth,
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { userLoginZodSchema, userZodSchema } from "../models/userSchema.js";
import { protect } from "../middlewares/authMiddleware.js";
const authRouter = express.Router();

authRouter.post("/register", validateRequest(userZodSchema), createUser);
authRouter.post("/login", validateRequest(userLoginZodSchema), loginUser);
authRouter.post("/logout", protect, logoutUser);
authRouter.get("/check", protect, checkAuth);

export default authRouter;
