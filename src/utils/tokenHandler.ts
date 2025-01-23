import { Response } from "express";
import jwt from "jsonwebtoken";
import env from "../env.js";
import RefreshToken from "../models/refreshTokenSchema.js";
import { accessTokenExpiry } from "../constants.js";

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge: number;
  path: string;
  domain?: string;
  signed?: boolean;
}

const getCookieOptions = (expiry = accessTokenExpiry): CookieOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: expiry,
  path: "/",
  signed: true,
});

export const generateToken = (id: string, expiresIn: string): string => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn,
  });
};

export const setTokenCookie = (
  res: Response,
  token: string,
  cookieName: string,
  expiry: number
): void => {
  res.cookie(cookieName, token, getCookieOptions(expiry));
};

export const clearTokenCookie = (res: Response, cookieName: string): void => {
  res.cookie(cookieName, "", {
    ...getCookieOptions(0),
    maxAge: 0,
  });
};

export const storeRefreshToken = async (
  token: string,
  userId: string,
  expiresAt: Date
): Promise<void> => {
  await RefreshToken.create({ token, userId, expiresAt });
};

export const revokeAllRefreshTokens = async (userId: string): Promise<void> => {
  await RefreshToken.deleteMany({ userId });
};

export const isTokenRevoked = async (token: string): Promise<boolean> => {
  const refreshToken = await RefreshToken.findOne({ token });
  return !refreshToken;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    jwt.verify(token, env.JWT_SECRET);
    return false;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return true;
    }
    throw error;
  }
};
