import { RequestHandler } from "express";
import { ValidatedRequest } from "../types/express.js";
import { catchAsync } from "../utils/errorHandler.js";
import { UserRegisterType } from "../types/user.js";
import User from "../models/userSchema.js";
import { sendResponse } from "../utils/responseHandler.js";
import { generateToken, setTokenCookie } from "../utils/tokenHandler.js";

export const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData: UserRegisterType = (req as ValidatedRequest).validatedData
    ?.body;
  if (!userData) {
    res.status(400).json({ success: false, message: "Invalid request data" });
    return;
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    res.status(400).json({ success: false, message: "User already exists" });
    return;
  }

  const user = await User.create(userData);
  const { password, ...rest } = user.toObject();
  res.status(201).json({ success: true, data: rest });
});

export const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = (req as ValidatedRequest).validatedData?.body;

  const user = await User.findOne({ email: userData.email }).select(
    "+password"
  );
  if (!user) {
    sendResponse(res, 401, {
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const isPasswordCorrect = await user.comparePassword(userData.password);
  if (!isPasswordCorrect) {
    sendResponse(res, 401, {
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const token = generateToken(user._id as string);
  setTokenCookie(res, token);

  user.lastLogin = new Date();
  user.loginHistory = user.loginHistory || [];
  user.loginHistory.push({
    timestamp: new Date(),
    ip: req.ip!,
    device: req.headers["user-agent"] || "unknown",
  });
  await user.save();

  user.password = "";

  sendResponse(res, 200, {
    success: true,
    data: {
      user,
      token,
    },
  });
});
