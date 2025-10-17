import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

/**
 * 🟢 Registrierung eines neuen Users
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Name, Email und Passwort erforderlich" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Benutzer existiert bereits" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Serverfehler bei der Registrierung" });
  }
};

/**
 * 🟢 Login eines bestehenden Users
 */

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email und Passwort erforderlich" });
    }

    // 🔹 Lade User mit allen Feldern inkl. Name
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(401).json({ message: "Ungültige Zugangsdaten" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: "Ungültige Zugangsdaten" });

    // 🔹 Name sicherstellen (falls z. B. null)
    const name = user.name || "";

    // 🔹 Token mit Name erstellen
    const token = jwt.sign(
      { id: user.id, email: user.email, name },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Serverfehler beim Login" });
  }
};




/**
 * 🟢 Authentifizierten User abrufen (z. B. fürs Dashboard)
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Nicht autorisiert" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }, 
    });

    if (!user) return res.status(404).json({ message: "Benutzer nicht gefunden" });

    res.json({ user });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Fehler beim Laden des Benutzers" });
  }
};

