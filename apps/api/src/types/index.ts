import { Request } from "express";

export interface AuthRequest extends Request {
  user?: { id: number };
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserResponse;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  error?: string;
}
