import { RequestHandler } from "express";
import { ValidatedRequest } from "../types/express.js";
import { UserRegisterType } from "../types/user.js";
import User from "../models/userSchema.js";
import { sendResponse } from "../utils/responseHandler.js";
import {
  generateToken,
  setTokenCookie,
  storeRefreshToken,
  revokeAllRefreshTokens,
  clearTokenCookie,
} from "../utils/tokenHandler.js";
import { accessTokenExpiry, refreshTokenExpiry } from "../constants.js";
import { catchAsync } from "../utils/errorHandler.js";
import RefreshToken from "../models/refreshTokenSchema.js";
import jwt from "jsonwebtoken";
import env from "../env.js";

export const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData: UserRegisterType = (req as ValidatedRequest).validatedData
    ?.body;
  if (!userData) {
    return sendResponse(res, 400, {
      success: false,
      message: "Invalid request data",
    });
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return sendResponse(res, 400, {
      success: false,
      message: "User already exists",
    });
  }

  const user = await User.create(userData);

  const accessToken = generateToken(user._id as string, "15m");
  const refreshToken = generateToken(user._id as string, "7d");
  setTokenCookie(res, accessToken, "accessToken", accessTokenExpiry);
  setTokenCookie(res, refreshToken, "refreshToken", refreshTokenExpiry);
  await storeRefreshToken(
    refreshToken,
    user._id as string,
    new Date(Date.now() + refreshTokenExpiry)
  );

  user.lastLogin = new Date();
  user.loginHistory = user.loginHistory || [];
  user.loginHistory.push({
    timestamp: new Date(),
    ip: req.ip!,
    device: req.headers["user-agent"] || "unknown",
  });
  await user.save();

  const { _id, bio, name, email, avatar, preferences, socialLinks, location } =
    user.toObject();

  return sendResponse(res, 201, {
    success: true,
    data: {
      user: {
        _id,
        bio,
        name,
        email,
        avatar,
        preferences,
        socialLinks,
        location,
      },
    },
  });
});

export const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = (req as ValidatedRequest).validatedData?.body;

  const user = await User.findOne({ email: userData.email }).select(
    "+password"
  );
  if (!user) {
    return sendResponse(res, 401, {
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await user.comparePassword(userData.password);
  if (!isPasswordCorrect) {
    return sendResponse(res, 401, {
      success: false,
      message: "Invalid email or password",
    });
  }

  const accessToken = generateToken(user._id as string, "15m");
  const refreshToken = generateToken(user._id as string, "7d");
  setTokenCookie(res, accessToken, "accessToken", accessTokenExpiry);
  setTokenCookie(res, refreshToken, "refreshToken", refreshTokenExpiry);
  await storeRefreshToken(
    refreshToken,
    user._id as string,
    new Date(Date.now() + refreshTokenExpiry)
  );

  user.lastLogin = new Date();
  user.loginHistory = user.loginHistory || [];
  user.loginHistory.push({
    timestamp: new Date(),
    ip: req.ip!,
    device: req.headers["user-agent"] || "unknown",
  });
  await user.save();

  const { _id, bio, name, email, avatar, preferences, socialLinks, location } =
    user.toObject();

  return sendResponse(res, 200, {
    success: true,
    data: {
      user: {
        _id,
        bio,
        name,
        email,
        avatar,
        preferences,
        socialLinks,
        location,
      },
    },
  });
});

export const logoutUser: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return sendResponse(res, 401, {
      success: false,
      message: "Not authenticated",
    });
  }

  const refreshToken = req.cookies.refreshToken;
  const allDevices = req.body.allDevices === true;

  if (allDevices) {
    await revokeAllRefreshTokens(userId);
  } else if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  clearTokenCookie(res, "accessToken");
  clearTokenCookie(res, "refreshToken");

  return sendResponse(res, 200, {
    success: true,
    message: allDevices
      ? "Logged out successfully from all devices"
      : "Logged out successfully",
  });
});

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

export const checkAuth: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return sendResponse(res, 401, {
      success: false,
      message: "Not authenticated",
    });
  }

  const user = await User.findById(userId).select(
    "_id bio name email avatar preferences socialLinks location"
  );
  if (!user) {
    return sendResponse(res, 401, {
      success: false,
      message: "User not found",
    });
  }

  return sendResponse(res, 200, {
    success: true,
    data: user,
  });
});

export const silentRenew: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken || typeof refreshToken !== "string") {
    return sendResponse(res, 401, {
      success: false,
      message: "Refresh token not found",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { id: string };
  } catch (error) {
    return sendResponse(res, 401, {
      success: false,
      message: "Invalid refresh token",
    });
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return sendResponse(res, 404, {
      success: false,
      message: "User not found",
    });
  }

  const newAccessToken = generateToken(user._id as string, "15m");
  const newRefreshToken = generateToken(user._id as string, "7d");

  await RefreshToken.create({
    token: newRefreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + refreshTokenExpiry),
  });

  setTokenCookie(res, newAccessToken, "accessToken", accessTokenExpiry);
  setTokenCookie(res, newRefreshToken, "refreshToken", refreshTokenExpiry);

  return sendResponse(res, 200, {
    success: true,
    message: "Tokens refreshed successfully",
  });
});
