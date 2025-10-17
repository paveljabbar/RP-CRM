"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

const onSubmit = async (data: LoginForm) => {
  setError(null);
  setSuccess(null);

  try {
  const res = await axios.post("http://localhost:4000/auth/login", data);
  console.log("Antwort vom Backend:", res.data);
  const token = res.data.token;
  localStorage.setItem("token", token);
  setSuccess("Login erfolgreich!");
  window.location.href = "/dashboard";
} catch (err: any) {
  console.error("Fehler beim Login:", err);
  setError(err.response?.data?.message || "Login fehlgeschlagen");
}
};


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#7A7A7A]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
       <img
  src="/logo.svg"
  alt="Logo"
  className="mx-auto mb-4 w-32 h-32 object-contain"
/>
 
        <h1 className="text-2xl font-bold mb-4 text-center">Anmelden</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("email")} placeholder="E-Mail" className="w-full border p-2 rounded" />
          <input {...register("password")} type="password" placeholder="Passwort" className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
    </main>
  );
}
