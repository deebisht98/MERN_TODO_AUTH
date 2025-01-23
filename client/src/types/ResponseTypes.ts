export type SuccessResponse = {
  success: true;
  message?: string;
  data?: unknown;
};

export type ErrorResponse = {
  success: false;
  message?: string;
  validationErrors?: Record<string, string>;
};
