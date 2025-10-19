"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";


export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
// 🧠 State für Berater bearbeiten
const [showAdvisorModal, setShowAdvisorModal] = useState(false);
const [advisors, setAdvisors] = useState<any[]>([]);
const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);

// 🔹 Alle Benutzer (Berater) laden
const fetchAdvisors = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAdvisors(res.data);
  } catch (err) {
    console.error("Fehler beim Laden der Berater:", err);
  }
};

// 🔹 Aktualisiere den Kundenberater
const updateAdvisor = async () => {
  if (!selectedAdvisor) return alert("Bitte einen Berater auswählen.");

  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`,
      { advisorId: selectedAdvisor }, // 👈 Jetzt relational
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Berater erfolgreich geändert!");
    setShowAdvisorModal(false);
    window.location.reload(); // Ansicht aktualisieren
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Beraters:", err);
    alert("Fehler beim Aktualisieren des Beraters.");
  }
};


  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(res.data);
      } catch (err) {
        console.error("Fehler beim Laden des Kunden:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <p>Lade Kundendaten...</p>
      </main>
    );

  if (!customer)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <p>Kunde nicht gefunden.</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-gray-900">
      <h1 className="text-2xl font-semibold mb-8">
        Kundeninfo – {customer.firstName} {customer.lastName}
      </h1>

      {/* Oberer Bereich: Kundeninfo & Berater */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Kundeninfo */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Allgemeine Daten</h2>
          <div className="text-sm leading-7">
            <p><strong>Adresse:</strong> {customer.street || "-"}</p>
            <p><strong>PLZ / Ort:</strong> {customer.zip || "-"} {customer.city || "-"}</p>
            <p><strong>Geburtsdatum:</strong> {customer.birthDate || "-"}</p>
            <p><strong>Nationalität:</strong> {customer.nationality || "-"}</p>
            <p><strong>Zivilstand:</strong> {customer.maritalStatus || "-"}</p>
            <p><strong>Beruf:</strong> {customer.occupation || "-"}</p>
            <p><strong>AHV:</strong> {customer.ahvNumber || "-"}</p>
          </div>
        </section>

        {/* Berater */}
        <section className="bg-white rounded-xl shadow-md p-6 relative">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h2 className="text-lg font-semibold">Berater</h2>
              <button
                onClick={() => {
                  setSelectedAdvisor(customer.advisor?.id?.toString() || "");
                  setShowAdvisorModal(true);
                  fetchAdvisors();
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                ✏️
              </button>
          </div>
          <div className="text-sm leading-7">
            <p><strong>Name:</strong> {customer.advisor?.name || "Kein Berater zugewiesen"}</p>
            <p><strong>E-Mail:</strong> {customer.advisor?.email || "-"}</p>
          </div>
        </section>

      </div>

      {/* Mittlerer Bereich: Policen & Anträge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Policen */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Policen</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            📄 (noch keine Daten)
          </p>
        </section>

        {/* Anträge */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Anträge</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            📄 (noch keine Daten)
          </p>
        </section>
      </div>

      {/* Unterer Bereich: Dokumente */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Dokumente</h2>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          📁 (Dateiupload kommt später)
        </p>
      </section>
     
      {showAdvisorModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 shadow-lg w-[400px]">
      <h2 className="text-xl font-bold mb-4 text-center">Berater ändern</h2>

      <select
        className="w-full border p-2 rounded mb-4"
        value={selectedAdvisor || ""}
        onChange={(e) => setSelectedAdvisor(e.target.value)}
      >
        <option value="">-- Bitte Berater wählen --</option>
        {advisors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} ({a.email})
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowAdvisorModal(false)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Abbrechen
        </button>
        <button
          onClick={updateAdvisor}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}
