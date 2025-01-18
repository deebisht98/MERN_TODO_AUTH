import { z } from "zod";
import { userZodSchema, userLoginZodSchema } from "../models/userSchema.js";

export type UserRegisterType = z.infer<typeof userZodSchema>;
export type UserLoginType = z.infer<typeof userLoginZodSchema>;
