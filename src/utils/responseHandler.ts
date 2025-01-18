import { Response } from "express";

type ResponseData = {
  success?: boolean;
  status?: string;
  message?: string;
  data?: any;
  errors?: Record<string, string>;
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: ResponseData
) => {
  res.status(statusCode).json(data);
};
