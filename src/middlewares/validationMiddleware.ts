import { RequestHandler } from "express";
import { AnyZodObject } from "zod";
import { ValidatedRequest } from "../types/express.js";

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

        res.status(400).json({
          success: false,
          errors: errorMap,
        });
        return;
      }

      (req as ValidatedRequest).validatedData = {
        body: result.data,
        query: req.query,
        params: req.params,
      };
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: { general: "Internal validation error" },
      });
      return;
    }
  };
};
