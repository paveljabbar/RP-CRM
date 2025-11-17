import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { AuthRequest } from "../types";

/**
 * Register a new user
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: ERROR_MESSAGES.MISSING_CREDENTIALS });
    }

    const user = await authService.registerUser(email, password, name);

    res.status(201).json({
      message: SUCCESS_MESSAGES.USER_CREATED,
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_MESSAGES.USER_EXISTS) {
      return res.status(409).json({ message: error.message });
    }
    handleError(res, error, "Serverfehler bei der Registrierung");
  }
};

/**
 * Login user
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: ERROR_MESSAGES.MISSING_EMAIL_PASSWORD });
    }

    const result = await authService.loginUser(email, password);

    res.json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
      return res.status(401).json({ message: error.message });
    }
    handleError(res, error, "Serverfehler beim Login");
  }
};

/**
 * Get all users (for advisor selection)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    handleError(res, error, "Fehler beim Laden der Benutzerliste");
  }
};

/**
 * Get authenticated user info
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    res.json({ user });
  } catch (error) {
    handleError(res, error, "Fehler beim Laden des Benutzers");
  }
};

