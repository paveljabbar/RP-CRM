"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddCustomer from "./addcustomer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Kunden abrufen (mit Auth Header)
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Keine gültige Sitzung. Bitte melde dich neu an.");
        window.location.href = "/login";
        return;
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers(res.data);
    } catch (err: any) {
      console.error("Fehler beim Abrufen der Kunden:", err.response?.data || err);

      if (err.response?.status === 401) {
        alert("Deine Sitzung ist abgelaufen. Bitte melde dich neu an.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0";
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      {/* Kopfzeile */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kundenverwaltung</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Neuer Kunde
        </button>
      </div>

      {/* Kunden-Tabelle */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">E-Mail</th>
              <th className="p-3">Telefon</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Keine Kunden vorhanden
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email || "-"}</td>
                  <td className="p-3">{c.phone || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <AddCustomer
          onClose={() => setShowModal(false)}
          onCustomerAdded={fetchCustomers}
        />
      )}
    </main>
  );
}
