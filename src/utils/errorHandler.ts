import { Response, RequestHandler } from "express";
import mongoose from "mongoose";

export const handleControllerError = (error: unknown, res: Response): void => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    const errorMap: Record<string, string> = {};
    Object.keys(error.errors).forEach((key) => {
      errorMap[key] = error.errors[key].message;
    });
    res.status(400).json({ success: false, errors: errorMap });
    return;
  }

  res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : "Internal server error",
  });
};

export const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) =>
      handleControllerError(error, res)
    );
  };
};
