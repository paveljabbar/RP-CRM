import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ERROR_MESSAGES } from "../constants/messages";
import { AuthRequest } from "../types";

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: ERROR_MESSAGES.NO_TOKEN });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: number };
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(403).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
  }
};
