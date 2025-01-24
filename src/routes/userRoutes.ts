import express from "express";
import {
  getLoginHistory,
  getUserSettings,
  updateUserSettings,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.use(protect);

userRouter.get("/loginHistory", getLoginHistory);
userRouter.route("/settings").get(getUserSettings).patch(updateUserSettings);
userRouter.delete("/deleteAccount", deleteUser);

export default userRouter;
