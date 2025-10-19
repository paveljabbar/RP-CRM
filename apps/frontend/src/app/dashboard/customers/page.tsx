"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddCustomer from "./addcustomer";
import Link from "next/link";


export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>("lastName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

// Kunde löschen
const handleDelete = async (id: number) => {
  if (!confirm("Möchtest du diesen Kunden wirklich löschen?")) return;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCustomers(); // Liste neu laden
  } catch (err) {
    console.error("Fehler beim Löschen des Kunden:", err);
    alert("Kunde konnte nicht gelöscht werden.");
  }
};

// Kunde bearbeiten (wird später Modal öffnen)
const handleEdit = (customer: any) => {
  console.log("Bearbeiten:", customer);
  alert(`Bearbeiten von Kunde: ${customer.firstName} ${customer.lastName}`);
};



// Gefilterte Kundenliste (mit Suchfeld + Toggle-Logik)
// Gefilterte + sortierte Kundenliste
const filteredCustomers = [...customers]
  .filter((c) => {
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    return matchesSearch;

  })
  .sort((a, b) => {
    const aVal = (a[sortField] || "").toString().toLowerCase();
    const bVal = (b[sortField] || "").toString().toLowerCase();

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });




  // Kunden abrufen (mit Auth Header)
// Kunden abrufen (mit optionalem Filter für "Meine Kunden")
const fetchCustomers = async (showAdvisorOnly = false) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Keine gültige Sitzung. Bitte melde dich neu an.");
      window.location.href = "/login";
      return;
    }

    // Falls showAdvisorOnly = true → ?advisor=true anhängen
    const query = showAdvisorOnly ? "?advisor=true" : "";

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/customers${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

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
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Keine gültige Sitzung. Bitte melde dich neu an.");
    window.location.href = "/login";
    return;
  }

  // 🧠 Userdaten laden, um userId zu kennen
  axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUserId(res.data.user.id); // 👈 ID speichern
      fetchCustomers(); // Kunden erst danach laden
    })
    .catch(() => {
      alert("Sitzung abgelaufen. Bitte erneut anmelden.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
}, []);


  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">



{/* Kopfzeile */}
<div className="mb-6">
  <h1 className="text-2xl font-bold mb-4">Kundenverwaltung</h1>


{/* Toggle: Alle / Meine Kunden */}
<div className="flex gap-3 mb-4">
  <button
    onClick={() => {
      setShowOnlyMine(false);
      fetchCustomers(false);
    }}
    className={`px-5 py-2 rounded-lg font-medium transition ${
      !showOnlyMine
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
  >
    Alle Kunden
  </button>

  <button
    onClick={() => {
      setShowOnlyMine(true);
      fetchCustomers(true);
    }}
    className={`px-5 py-2 rounded-lg font-medium transition ${
      showOnlyMine
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
  >
    Meine Kunden
  </button>

</div>




  {/* Suchfeld + Neuer Kunde */}
  <div className="flex items-center justify-between">
    <input
      type="text"
      placeholder="🔍 Suche nach Name..."
      className="border rounded px-3 py-2 text-sm w-64"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
    >
      + Neuer Kunde
    </button>
  </div>
</div>



{/* Kunden-Tabelle */}
<div className="bg-white rounded shadow overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-200 text-left text-sm">
      <tr>
        {[
          { key: "lastName", label: "Name" },
          { key: "privateEmailPart1", label: "E-Mail" },
          { key: "street", label: "Adresse" },
          { key: "zip", label: "PLZ" },
          { key: "city", label: "Ort" },
          { key: "advisor", label: "Berater" },
          { key: "user", label: "Erstellt von" }, 
        ].map((col) => (
          <th
            key={col.key}
            className="p-3 cursor-pointer select-none hover:bg-gray-300 transition"
            onClick={() => {
              if (sortField === col.key) {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              } else {
                setSortField(col.key);
                setSortOrder("asc");
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span>{col.label}</span>
              {sortField === col.key && (
                <span>{sortOrder === "asc" ? "🔼" : "🔽"}</span>
              )}
            </div>
          </th>
        ))}
        {/* 👇 Neue Spalte für Aktionen */}
        <th className="p-3 bg-gray-200 text-gray-700 font-semibold">Aktionen</th>
      </tr>
    </thead>
    <tbody>
      {filteredCustomers.length === 0 ? (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-500">
            Keine Kunden vorhanden
          </td>
        </tr>
      ) : (
        filteredCustomers.map((c) => (
          <tr key={c.id} className="border-t hover:bg-gray-50">
            {/* Name = Nachname + Vorname */}
            <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer">
              <Link href={`/dashboard/customers/${c.id}`}>
                {c.lastName || "-"}, {c.firstName || "-"}
              </Link>
            </td>


            {/* E-Mail zusammensetzen */}
            <td className="p-3 text-gray-700">
              {c.privateEmailPart1 && c.privateEmailPart2
                ? `${c.privateEmailPart1}@${c.privateEmailPart2}`
                : "-"}
            </td>

            {/* Adresse */}
            <td className="p-3 text-gray-700">{c.street || "-"}</td>

            {/* PLZ */}
            <td className="p-3 text-gray-700">{c.zip || "-"}</td>

            {/* Ort */}
            <td className="p-3 text-gray-700">{c.city || "-"}</td>

            {/* Hauptberater */}
            <td className="p-3 text-gray-700">
            {c.advisor ? c.advisor.name || c.advisor.email : "-"}</td>
            {/* Erstellt von */}
            <td className="p-3 text-gray-700">{c.user?.name || "-"}</td>
            {/* Aktionen */}
            <td className="p-3 flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded"
              >
              ✏️
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
              >
                X
              </button>
            </td>
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
