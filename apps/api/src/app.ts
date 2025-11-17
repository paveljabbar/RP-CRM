import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import customersRouter from "./routes/customers.routes";
import { config } from "./config";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/customers", customersRouter);

export default app;
