import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { AuthRequest } from "../types";
import { customerService } from "../services/customer.service";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";

const router = express.Router();

/**
 * Get all active customers
 */
router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const showAdvisorOnly = req.query.advisor === "true";
    
    const filter = {
      deleted: false,
      ...(showAdvisorOnly && { advisorId: req.user!.id }),
    };

    const customers = await customerService.getCustomers(filter);
    res.json(customers);
  } catch (err) {
    handleError(res, err, "Fehler beim Abrufen der Kunden");
  }
});

/**
 * Get single customer by ID
 */
router.get("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(Number(id));
    res.json(customer);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.CUSTOMER_NOT_FOUND) {
      return res.status(404).json({ message: err.message });
    }
    handleError(res, err, "Fehler beim Laden des Kunden");
  }
});

/**
 * Create new customer
 */
router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const data = req.body;
    
    // Convert zip to number if provided
    if (data.zip) {
      data.zip = Number(data.zip);
    }
    
    // Convert advisorId to number if provided
    if (data.advisorId) {
      data.advisorId = Number(data.advisorId);
    }
    
    const customer = await customerService.createCustomer({
      ...data,
      userId: req.user!.id,
    });

    res.status(201).json(customer);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.AHV_EXISTS) {
      return res.status(400).json({ message: err.message });
    }
    handleError(res, err, "Fehler beim Erstellen des Kunden");
  }
});

/**
 * Update existing customer
 */
router.put("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Convert advisorId to number if provided
    if (data.advisorId) {
      data.advisorId = Number(data.advisorId);
    }

    const updated = await customerService.updateCustomer(Number(id), {
      ...data,
      userId: req.user!.id,
    });

    res.json(updated);
  } catch (err: any) {
    if (err.message === ERROR_MESSAGES.CUSTOMER_NOT_FOUND) {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === ERROR_MESSAGES.ADVISOR_NOT_FOUND) {
      return res.status(400).json({ message: err.message });
    }
    handleError(res, err, "Fehler beim Aktualisieren des Kunden");
  }
});

/**
 * Soft delete customer
 */
router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await customerService.deleteCustomer(Number(id));
    res.json({ message: SUCCESS_MESSAGES.CUSTOMER_DELETED });
  } catch (err) {
    handleError(res, err, "Fehler beim Soft Delete des Kunden");
  }
});

export default router;
