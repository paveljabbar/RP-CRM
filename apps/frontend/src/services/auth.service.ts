import apiClient from "../lib/apiClient";
import { ROUTES } from "../constants";
import { LoginResponse, User } from "../types";

export const authService = {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string) {
    const response = await apiClient.post(ROUTES.AUTH.REGISTER, {
      email,
      password,
      name,
    });
    return response.data;
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(ROUTES.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get current user info
   */
  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>(ROUTES.AUTH.ME);
    return response.data;
  },

  /**
   * Get all users (for advisor selection)
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(ROUTES.AUTH.USERS);
    return response.data;
  },
};
