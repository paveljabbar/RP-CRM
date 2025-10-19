import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();
const prisma = new PrismaClient({
  log: ['error'],
});


// 📋 Alle aktiven Kunden abrufen (GET /customers)
router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try { 

    let filter: any = { deleted: false };

    // Wenn ?advisor=true gesetzt → zeige Kunden, bei denen der eingeloggte User Berater ist
    if (req.query.advisor === "true") {
      filter.advisorId = Number(req.user!.id);
    }


    const customers = await prisma.customer.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        advisor: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(customers);
  } catch (err) {
    console.error("Fehler beim Abrufen der Kunden:", err);
    res.status(500).json({ message: "Fehler beim Abrufen der Kunden" });
  }
});



// 📄 Einzelnen Kunden abrufen (GET /customers/:id)
router.get("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, name: true, email: true } },     // Ersteller
        advisor: { select: { id: true, name: true, email: true } },  // Hauptberater
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Kunde nicht gefunden" });
    }

    res.json(customer);
  } catch (err: any) {
    console.error("Fehler beim Laden des Kunden:", err);
    res.status(500).json({ message: err.message || "Fehler beim Laden des Kunden" });
  }
});





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

    // 🔹 Advisor separat behandeln
    const advisorConnect =
      data.advisorId && Number(data.advisorId) > 0
        ? { connect: { id: Number(data.advisorId) } }
        : undefined;

    // Kunde wird automatisch mit eingeloggtem Benutzer verknüpft
    const customer = await prisma.customer.create({
      data: {
        category: data.category,
        language: data.language,
        noContact: data.noContact,
        gender: data.gender,
        salutation: data.salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        maritalStatus: data.maritalStatus,
        birthDate: data.birthDate,
        ahvNumber: data.ahvNumber,
        nationality: data.nationality,
        foreignPermit: data.foreignPermit,
        street: data.street,
        zip: data.zip ? Number(data.zip) : null,
        city: data.city,
        livingSituation: data.livingSituation,
        occupation: data.occupation,
        mobileCode: data.mobileCode,
        mobile: data.mobile,
        workPhoneCode: data.workPhoneCode,
        workPhone: data.workPhone,
        privateEmailPart1: data.privateEmailPart1,
        privateEmailPart2: data.privateEmailPart2,
        workEmailPart1: data.workEmailPart1,
        workEmailPart2: data.workEmailPart2,
        recommendation: data.recommendation,
        relationToRecommender: data.relationToRecommender,
        advisor: advisorConnect,
        user: { connect: { id: req.user!.id } },
      },
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error("Fehler beim Erstellen des Kunden:", err);
    res.status(500).json({ message: "Fehler beim Erstellen des Kunden" });
  }
});


// ✏️ Bestehenden Kunden bearbeiten (PUT /customers/:id)
router.put("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // 🔹 Prüfen, ob Kunde existiert
    const existing = await prisma.customer.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ message: "Kunde nicht gefunden" });
    }

    // 🔹 Wenn advisorId im Body ist, prüfen ob dieser User existiert
    if (data.advisorId) {
      const advisorExists = await prisma.user.findUnique({
        where: { id: Number(data.advisorId) },
      });

      if (!advisorExists) {
        return res.status(400).json({ message: "Berater nicht gefunden" });
      }
    }

    // 🔹 Kunde aktualisieren (inkl. advisorId)
    const updated = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        // advisorId aus req.body entfernen, Rest übernehmen
        ...Object.fromEntries(Object.entries(data).filter(([key]) => key !== "advisorId")),
        advisor: data.advisorId
          ? { connect: { id: Number(data.advisorId) } }
          : undefined,
        user: { connect: { id: req.user!.id } },
      },

      include: {
        user: { select: { id: true, name: true, email: true } }, // Ersteller
        advisor: { select: { id: true, name: true, email: true } }, // Hauptberater
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Kunden:", err);
    res.status(500).json({ message: "Fehler beim Aktualisieren des Kunden" });
  }
});






// 🗑️ Kunden "Soft Delete" (DELETE /customers/:id)
router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Statt löschen: auf deleted = true setzen
    await prisma.customer.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });

    res.json({ message: "Kunde wurde als gelöscht markiert" });
  } catch (err) {
    console.error("Fehler beim Soft Delete:", err);
    res.status(500).json({ message: "Fehler beim Soft Delete des Kunden" });
  }
});


export default router;
