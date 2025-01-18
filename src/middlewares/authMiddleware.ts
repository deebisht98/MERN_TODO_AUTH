import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { sendResponse } from "../utils/responseHandler.js";
import env from "../env.js";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect: RequestHandler = async (req, res, next) => {
  try {
    let token;

    if (req.signedCookies.token) {
      token = req.signedCookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      sendResponse(res, 401, {
        success: false,
        message: "Not authorized, please log in",
      });
    }

    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      sendResponse(res, 401, {
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      sendResponse(res, 401, {
        success: false,
        message: "Invalid token, please log in again",
      });
    }

    sendResponse(res, 401, {
      success: false,
      message: "Not authorized, please log in",
    });
  }
};
