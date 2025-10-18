import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Diese Seiten sind nur für eingeloggte Benutzer zugänglich
const protectedRoutes = ["/dashboard", "/dashboard/customers", "/dashboard/profile"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";

  // Wenn Benutzer versucht, eine geschützte Seite ohne Token aufzurufen
  if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      // Redirect zu /login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Wenn Benutzer bereits eingeloggt ist und auf /login geht → redirect zu /dashboard
  if (request.nextUrl.pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Alles ok → Seite laden
  return NextResponse.next();
}

// Middleware aktivieren für alle Routen
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
