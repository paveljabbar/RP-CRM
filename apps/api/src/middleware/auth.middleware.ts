import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 🔹 eigener Typ für Requests mit Benutzerinfos
export interface AuthRequest extends Request {
  user?: { id: number };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key") as { id: number };

    // Benutzer-ID im Request speichern
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
