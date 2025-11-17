import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ERROR_MESSAGES } from "../constants/messages";
import { UserResponse } from "../types";

export class AuthService {
  /**
   * Register a new user
   */
  async registerUser(email: string, password: string, name: string): Promise<UserResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_EXISTS);
    }

    const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);

    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Login user and generate JWT token
   */
  async loginUser(email: string, password: string): Promise<{ token: string; user: UserResponse }> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const name = user.name || "";

    const token = jwt.sign(
      { id: user.id, email: user.email, name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      token,
      user: { id: user.id, email: user.email, name },
    };
  }

  /**
   * Get all users (for advisor selection)
   */
  async getAllUsers(): Promise<UserResponse[]> {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    return user;
  }
}

export const authService = new AuthService();
