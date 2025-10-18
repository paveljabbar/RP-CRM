import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import customersRouter from "./routes/customers.routes";

// 🔧 .env laden
dotenv.config();

// 🚀 Express-App erstellen
const app = express();

// 🔧 Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// 🟢 Routen
app.use("/auth", authRoutes);
app.use("/customers", customersRouter);

export default app;
