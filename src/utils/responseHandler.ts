import { Response } from "express";

type SuccessResponse = {
  success: true;
  message?: string;
  data?: any;
};

type ErrorResponse = {
  success: false;
  message?: string;
  validationErrors?: Record<string, string>;
};

type ResponseData = SuccessResponse | ErrorResponse;

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: ResponseData
) => {
  res.status(statusCode).json(data);
};
