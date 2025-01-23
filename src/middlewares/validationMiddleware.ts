import { RequestHandler } from "express";
import { AnyZodObject } from "zod";
import { ValidatedRequest } from "../types/express.js";
import { sendResponse } from "../utils/responseHandler.js";

export const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        const errorMap: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path) {
            const path = err.path.join(".");
            errorMap[path] = err.message;
          }
        });
        return sendResponse(res, 400, {
          success: false,
          validationErrors: errorMap,
        });
      }

      (req as ValidatedRequest).validatedData = {
        body: result.data,
        query: req.query,
        params: req.params,
      };
      next();
    } catch (error) {
      return sendResponse(res, 500, {
        success: false,
        message: "Internal validation error",
      });
    }
  };
};
