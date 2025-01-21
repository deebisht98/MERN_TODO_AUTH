import express from "express";
import {
  getLoginHistory,
  getUserSettings,
  updateUserSettings, // Import the function
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.use(protect);

userRouter.get("/loginHistory", getLoginHistory);
userRouter.route("/settings").get(getUserSettings).patch(updateUserSettings);

export default userRouter;
