import { RequestHandler } from "express";
import { catchAsync } from "../utils/errorHandler.js";
import User from "../models/userSchema.js";
import { sendResponse } from "../utils/responseHandler.js";
import RefreshToken from "../models/refreshTokenSchema.js";
import { Todo } from "../models/todoSchema.js"; // Import the Todo model
import { generateToken, setTokenCookie } from "../utils/tokenHandler.js";
import { accessTokenExpiry, refreshTokenExpiry } from "../constants.js";
import jwt from "jsonwebtoken";
import env from "../env.js";

export const getLoginHistory: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("loginHistory");
  if (!user) {
    return sendResponse(res, 404, {
      success: false,
      message: "User not found",
    });
  }
  return sendResponse(res, 200, { success: true, data: user.loginHistory });
});

export const getUserSettings: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "_id bio name email avatar preferences socialLinks location"
  );
  if (!user) {
    return sendResponse(res, 404, {
      success: false,
      message: "User not found",
    });
  }
  return sendResponse(res, 200, { success: true, data: user });
});

export const updateUserSettings: RequestHandler = catchAsync(
  async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: "User not found",
      });
    }

    Object.assign(user, req.body);
    await user.save();

    const updatedUser = await User.findById(req.user.id).select(
      "_id bio name email avatar preferences socialLinks location"
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Settings updated successfully",
      data: updatedUser,
    });
  }
);

export const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Delete user
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return sendResponse(res, 404, {
      success: false,
      message: "User not found",
    });
  }

  // Delete user's tokens
  await RefreshToken.deleteMany({ userId });

  // Delete user's todos
  await Todo.deleteMany({ userId });

  // Optionally, delete other related data if any

  return sendResponse(res, 200, {
    success: true,
    message: "User and related data deleted successfully",
  });
});
