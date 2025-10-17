import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());

// Routen registrieren
app.use("/auth", authRouter);

export default app;
