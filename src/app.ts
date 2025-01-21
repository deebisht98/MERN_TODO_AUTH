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

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
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
