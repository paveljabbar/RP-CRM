"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("http://localhost:4000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#7A7A7A] text-black">
        <p>Lädt...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#7A7A7A]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <img
          src="/logo.svg"
          alt="Logo"
          className="mx-auto mb-4 w-24 h-24 object-contain"
        />

        <h1 className="text-2xl font-bold mb-2 text-black">
          Willkommen, {user?.name || "Benutzer"}
        </h1>
        <p className="text-gray-700 mb-6">Du bist jetzt eingeloggt 🎉</p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
