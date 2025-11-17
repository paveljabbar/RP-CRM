export const ERROR_MESSAGES = {
  // Auth
  MISSING_CREDENTIALS: "Name, Email und Passwort erforderlich",
  MISSING_EMAIL_PASSWORD: "Email und Passwort erforderlich",
  USER_EXISTS: "Benutzer existiert bereits",
  INVALID_CREDENTIALS: "Ungültige Zugangsdaten",
  UNAUTHORIZED: "Nicht autorisiert",
  NO_TOKEN: "No token provided",
  INVALID_TOKEN: "Invalid or expired token",
  USER_NOT_FOUND: "Benutzer nicht gefunden",
  
  // Customer
  CUSTOMER_NOT_FOUND: "Kunde nicht gefunden",
  AHV_EXISTS: "AHV-Nummer bereits vorhanden",
  ADVISOR_NOT_FOUND: "Berater nicht gefunden",
  
  // General
  SERVER_ERROR: "Serverfehler",
  LOAD_ERROR: "Fehler beim Laden",
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created",
  LOGIN_SUCCESS: "Login successful",
  CUSTOMER_DELETED: "Kunde wurde als gelöscht markiert",
} as const;
