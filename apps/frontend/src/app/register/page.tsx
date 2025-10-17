"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name zu kurz"),
  email: z.string().email("Ungültige E-Mail"),
  password: z.string().min(4, "Passwort zu kurz"),
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post("http://172.17.169.248:4000/auth/register", data);
      setSuccess("Registrierung erfolgreich! Du kannst dich jetzt anmelden.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrierung fehlgeschlagen");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#7A7A7A]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <img
          src="/logo.svg"
          alt="Logo"
          className="mx-auto mb-4 w-32 h-32 object-contain"
        />
        <h1 className="text-2xl font-bold mb-4 text-center">Registrieren</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name")}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("email")}
            placeholder="E-Mail"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("password")}
            type="password"
            placeholder="Passwort"
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Registrieren
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
    </main>
  );
}
