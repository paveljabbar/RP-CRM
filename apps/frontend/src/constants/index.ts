export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    USERS: "/auth/users",
  },
  CUSTOMERS: {
    BASE: "/customers",
    BY_ID: (id: number) => `/customers/${id}`,
  },
} as const;

export const ERROR_MESSAGES = {
  SESSION_EXPIRED: "Deine Sitzung ist abgelaufen. Bitte melde dich neu an.",
  NO_SESSION: "Keine gültige Sitzung. Bitte melde dich neu an.",
  GENERIC_ERROR: "Ein Fehler ist aufgetreten.",
  DELETE_CONFIRM: "Möchtest du diesen Kunden wirklich löschen?",
  DELETE_ERROR: "Kunde konnte nicht gelöscht werden.",
} as const;
