import { Response } from "express";
import jwt from "jsonwebtoken";
import env from "../env.js";
const tokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge: number;
  path: string;
  domain?: string;
  signed?: boolean;
}

const getCookieOptions = (expiry = tokenExpiry): CookieOptions => ({
  httpOnly: true, // Prevents client-side access to the cookie
  secure: env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict", // Protects against CSRF
  maxAge: expiry, // Cookie expiry time
  path: "/", // Cookie is available for all paths
  signed: true, // Signs the cookie for tampering protection
});

export const generateToken = (id: string): string => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, getCookieOptions());
};

export const clearTokenCookie = (res: Response): void => {
  res.cookie("token", "", {
    ...getCookieOptions(0),
    maxAge: 0,
  });
};
