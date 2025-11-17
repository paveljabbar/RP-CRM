import { useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((data) => {
        setUser(data.user);
        setError(null);
      })
      .catch((err) => {
        console.error("Auth error:", err);
        setError("Failed to load user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading, error };
};
