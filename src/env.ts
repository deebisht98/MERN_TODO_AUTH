import dotenv from "dotenv";
dotenv.config();

interface Env {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
}

const env: Env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 8000,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/mern-challenge",
  JWT_SECRET: process.env.JWT_SECRET || "",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "",
};

export default env;
