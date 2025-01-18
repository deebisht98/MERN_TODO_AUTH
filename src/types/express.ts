import { Request, Response, NextFunction } from "express";

export interface ValidatedRequest extends Request {
  validatedData?: {
    body: any;
    query: any;
    params: any;
  };
}

export type CustomRequestHandler = (
  req: ValidatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void | Response;
