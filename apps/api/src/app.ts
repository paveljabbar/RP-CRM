import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());

// 🧩 Dynamisches CORS – zieht Domain automatisch aus .env
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// 🟢 Auth-Routen
app.use("/auth", authRoutes);

export default app;
