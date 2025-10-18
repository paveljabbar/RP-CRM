"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Benutzer + Token prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        handleLogout();
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err: any) {
        console.warn("Token ungültig oder abgelaufen:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Hier NEU und richtig positioniert:
  // 🔹 Automatisches Logout bei Inaktivität
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("⏰ Inaktiv – automatisches Logout");
        handleLogout();
      }, 30 * 60_000); // aktuell 1 Minute (60_000 ms)
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, []);

  // 🔹 Logout-Funktion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };


  const navItems = [
    { name: "Übersicht", href: "/dashboard" },
    { name: "Kunden", href: "/dashboard/customers" },
    { name: "Profil", href: "/dashboard/profile" },
  ];

  const profileImage =
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${
      encodeURIComponent(user?.name || "User")
    }&background=0D8ABC&color=fff`;

  if (loading) return <div className="p-10 text-gray-600">Wird geladen...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* 🔵 Durchgehender Header-Schatten */}
      <header className="bg-white shadow-md z-10 relative flex items-center justify-between h-16 px-6">
        {/* Links: Logo + Firmenname */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-12 w-auto object-contain translate-y-[-1px]"
          />
        </div>

        {/* Rechts: Profilbild + Logout */}
        <div className="flex items-center gap-4">
          <img
            src={profileImage}
            alt="Profilbild"
            className="w-10 h-10 rounded-full border"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Hauptinhalt */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 z-0">
          <nav className="space-y-3 mt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded transition ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Seiteninhalt */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
