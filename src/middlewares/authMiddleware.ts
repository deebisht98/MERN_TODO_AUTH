import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { sendResponse } from "../utils/responseHandler.js";
import env from "../env.js";
import {
  generateToken,
  setTokenCookie,
  isTokenExpired,
  isTokenRevoked,
} from "../utils/tokenHandler.js";
import { accessTokenExpiry } from "../constants.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyAndSetUser = async (token: string, res: any, req: any) => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return sendResponse(res, 401, {
      success: false,
      message: "User no longer exists",
    });
  }
  req.user = user;
};

const isRefreshTokenRevoked = async (token: string) => {
  const isRevoked = await isTokenRevoked(token); // This line checks the refresh token in the database
  return isRevoked;
};

export const protect: RequestHandler = async (req, res, next) => {
  try {
    let { accessToken } = req.cookies;

    if (!accessToken) {
      return sendResponse(res, 401, {
        success: false,
        message: "Not authorized, please log in",
      });
    }

    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if (isTokenExpired(accessToken)) {
      const { refreshToken } = req.cookies;
      if (!refreshToken || isTokenExpired(refreshToken)) {
        return sendResponse(res, 401, {
          success: false,
          message: "Session expired, please log in again",
        });
      }
      const isRevoked = await isRefreshTokenRevoked(refreshToken);
      if (isRevoked) {
        return sendResponse(res, 401, {
          success: false,
          message: "Refresh token is revoked",
        });
      }

      await verifyAndSetUser(refreshToken, res, req);
      const newAccessToken = generateToken(req.user.id, "15m");
      setTokenCookie(res, newAccessToken, "accessToken", accessTokenExpiry);
      next();
    }

    await verifyAndSetUser(accessToken, res, req);
    next();
  } catch (error) {
    return sendResponse(res, 401, {
      success: false,
      message: "Not authorized, please log in",
    });
  }
};
