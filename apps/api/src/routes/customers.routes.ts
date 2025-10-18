import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();
const prisma = new PrismaClient();

// ➕ Neuen Kunden erstellen (POST /customers)
router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const data = req.body;

    // AHV prüfen
    if (data.ahvNumber) {
      const existing = await prisma.customer.findUnique({
        where: { ahvNumber: data.ahvNumber },
      });
      if (existing) {
        return res.status(400).json({ message: "AHV-Nummer bereits vorhanden" });
      }
    }

    // Kunde wird automatisch mit eingeloggtem Benutzer verknüpft
    const customer = await prisma.customer.create({
      data: {
        ...data,
        user: {
          connect: { id: req.user!.id },
        },
      },
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error("Fehler beim Erstellen des Kunden:", err);
    res.status(500).json({ message: "Fehler beim Erstellen des Kunden" });
  }
});

export default router;
