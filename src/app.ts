import express from "express";
import cookieParser from "cookie-parser";

import env from "./env.js";
import cors from "cors";
import connectDB from "./db/database.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

if (!env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not defined in environment variables");
}

connectDB();
const app = express();

app.use(cookieParser(env.COOKIE_SECRET)); // Move this before CORS

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Initial-Auth-Check"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Remove or modify the custom header middleware to avoid conflicts
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    req.headers.origin || "http://localhost:5173"
  );
  next();
});

app.use("/v1/users", userRoutes);
app.use("/v1/todos", todoRoutes);
app.use("/v1/auth", authRoutes);

const port = env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
