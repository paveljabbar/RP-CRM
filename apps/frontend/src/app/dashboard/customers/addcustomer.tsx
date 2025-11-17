
"use client";

import { useState, useEffect } from "react";
import { customerService } from "@/services/customer.service";
import { authService } from "@/services/auth.service";
import { User } from "@/types";

interface AddCustomerProps {
  onClose: () => void;
  onCustomerAdded: () => void;
}

export default function AddCustomer({ onClose, onCustomerAdded }: AddCustomerProps) {
  const [advisors, setAdvisors] = useState<(User & { hidden?: boolean })[]>([]);
  
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const users = await authService.getAllUsers();
        setAdvisors(users.map(u => ({ ...u, hidden: false })));
      } catch (err) {
        console.error("Error loading advisors:", err);
      }
    };
    fetchAdvisors();
  }, []);

  // Form data
  const [form, setForm] = useState({
    category: "",
    advisorId: null as number | null,
    language: "",
    noContact: false,

    gender: "",
    salutation: "",
    firstName: "",
    lastName: "",
    maritalStatus: "",
    birthDate: "",
    ahvNumber: "756.",
    nationality: "",
    foreignPermit: "",
    street: "",
    zip: "" as number | "",
    city: "",
    livingSituation: "",
    occupation: "",

    mobileCode: "+41",
    mobile: "",
    workPhoneCode: "+41",
    workPhone: "",
    privateEmailPart1: "",
    privateEmailPart2: "",
    workEmailPart1: "",
    workEmailPart2: "",
    recommendation: "",
    relationToRecommender: "",
  });

  const [showForeignPermit, setShowForeignPermit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Nationalities (Switzerland at top + rest alphabetically)
  const nationalities = [
    "Schweiz",
    "Deutschland",
    "Frankreich",
    "Italien",
    "Österreich",
    "Spanien",
    "Portugal",
    "Polen",
    "Türkei",
    "USA",
  ];

  // Foreign permits
  const foreignPermits = [
    "Ausländerausweis C",
    "Ausländerausweis B",
    "Ausweis Ci EU/EFTA",
    "Ausweis L EU/EFTA",
    "Ausweis F",
    "Ausweis G",
    "Ausweis für Asylsuchende N",
    "Ausweis S",
  ];

  // AHV validation
  const validateAhv = (ahv: string) => {
    const regex = /^756\.\d{4}\.\d{4}\.\d{2}$/;
    return regex.test(ahv);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!form.firstName.trim() || !form.lastName.trim()) {
      alert("Vorname und Nachname sind Pflichtfelder.");
      setLoading(false);
      return;
    }

    // Validate AHV
    if (!validateAhv(form.ahvNumber)) {
      alert("Ungültige AHV-Nummer. Bitte im Format 756.xxxx.xxxx.xx eingeben.");
      setLoading(false);
      return;
    }

    try {
      await customerService.createCustomer({
        ...form,
        advisorId: form.advisorId || undefined,
        zip: form.zip || undefined,
      });
      onCustomerAdded();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      console.error("Error adding customer:", error);
      alert(errorMessage || "Fehler beim Hinzufügen des Kunden");
    } finally {
      setLoading(false);
    }
  };

  // Show foreign permit only when nationality != Switzerland
  useEffect(() => {
    setShowForeignPermit(form.nationality !== "" && form.nationality !== "Schweiz");
  }, [form.nationality]);

  // Helper function to update fields
  const updateField = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20 overflow-y-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Neuen Kunden hinzufügen</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Basisdaten */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">Allgemeine Angaben</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Kundenkategorie */}
              <div>
                <label className="block text-sm font-medium mb-1">Kundenkategorie</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="Privatperson">Privatperson</option>
                  <option value="Unternehmen">Unternehmen</option>
                </select>
              </div>

              {/* Hauptberater */}
              <div>
                <label className="block text-sm font-medium mb-1">Hauptberater</label>

                {/* 🔍 Suchfeld */}
                <input
                  type="text"
                  placeholder="Berater suchen..."
                  className="border p-2 w-full rounded mb-2"
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    setAdvisors((prev) =>
                      prev.map((a) => ({
                        ...a,
                        hidden: !a.name?.toLowerCase().includes(query),
                      }))
                    );
                  }}
                />

                {/* 📋 Dropdown */}
                <select
                  className="border p-2 w-full rounded"
                  value={form.advisorId || ""}
                  onChange={(e) =>
                    updateField("advisorId", e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">Bitte wählen</option>
                  {advisors
                    .filter((a) => !a.hidden)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.email})
                      </option>
                    ))}
                </select>
              </div>



              {/* Korrespondenzsprache */}
              <div>
                <label className="block text-sm font-medium mb-1">Korrespondenzsprache</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.language}
                  onChange={(e) => updateField("language", e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="DE">DE</option>
                  <option value="FR">FR</option>
                  <option value="IT">IT</option>
                  <option value="EN">EN</option>
                </select>
              </div>

              {/* Kein Kontakt */}
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={form.noContact}
                  onChange={(e) => updateField("noContact", e.target.checked)}
                />
                <label className="text-sm">Kunde wünscht keinen Kontakt</label>
              </div>
            </div>
          </section>

          {/* SECTION 2: Persönliche Informationen */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">Persönliche Informationen</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Geschlecht */}
              <div>
                <label className="block text-sm font-medium mb-1">Geschlecht</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="m">m</option>
                  <option value="w">w</option>
                  <option value="d">d</option>
                </select>
              </div>

              {/* Anrede */}
              <div>
                <label className="block text-sm font-medium mb-1">Anrede</label>
                <div className="flex gap-4 mt-1">
                  <label>
                    <input
                      type="radio"
                      name="salutation"
                      value="Herr"
                      checked={form.salutation === "Herr"}
                      onChange={(e) => updateField("salutation", e.target.value)}
                    />{" "}
                    Herr
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="salutation"
                      value="Frau"
                      checked={form.salutation === "Frau"}
                      onChange={(e) => updateField("salutation", e.target.value)}
                    />{" "}
                    Frau
                  </label>
                </div>
              </div>

              {/* Vorname */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vorname <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>

              {/* Nachname */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nachname <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>

              {/* Zivilstand */}
              <div>
                <label className="block text-sm font-medium mb-1">Zivilstand</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.maritalStatus}
                  onChange={(e) => updateField("maritalStatus", e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="ledig">Ledig</option>
                  <option value="verheiratet">Verheiratet</option>
                  <option value="getrennt">Getrennt</option>
                  <option value="geschieden">Geschieden</option>
                  <option value="verwitwet">Verwitwet</option>
                  <option value="konkubinat">Konkubinat</option>
                  <option value="eingetragene Partnerschaft">Eing. Partnerschaft</option>
                </select>
              </div>

              {/* Geburtsdatum */}
              <div>
                <label className="block text-sm font-medium mb-1">Geburtsdatum</label>
                <input
                  type="text"
                  placeholder="DD.MM.YYYY"
                  className="border p-2 w-full rounded text-gray-500"
                  value={form.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                />
              </div>

              {/* AHV */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  AHV-Nummer <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.ahvNumber}
                  onChange={(e) => updateField("ahvNumber", e.target.value)}
                  placeholder="756.xxxx.xxxx.xx"
                />
              </div>

              {/* Nationalität */}
              <div>
                <label className="block text-sm font-medium mb-1">Nationalität</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.nationality}
                  onChange={(e) => updateField("nationality", e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  {nationalities.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ausländerausweis */}
              {showForeignPermit && (
                <div>
                  <label className="block text-sm font-medium mb-1">Ausländerausweis</label>
                  <select
                    className="border p-2 w-full rounded"
                    value={form.foreignPermit}
                    onChange={(e) => updateField("foreignPermit", e.target.value)}
                  >
                    <option value="">Bitte wählen</option>
                    {foreignPermits.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  placeholder="z. B. Bahnhofstrasse 12"
                  className="border p-2 w-full rounded"
                  value={form.street}
                  onChange={(e) => updateField("street", e.target.value)}
                />
              </div>

              {/* PLZ */}
              <div>
                <label className="block text-sm font-medium mb-1">PLZ</label>
                <input
                  type="text"
                  placeholder="z. B. 8001"
                  className="border p-2 w-full rounded"
                  value={form.zip}
                  onChange={(e) => updateField("zip", e.target.value ? Number(e.target.value) : "")}
                />
              </div>

              {/* Ort */}
              <div>
                <label className="block text-sm font-medium mb-1">Ort</label>
                <input
                  type="text"
                  placeholder="z. B. Zürich"
                  className="border p-2 w-full rounded"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>




              {/* Wohnsituation */}
              <div>
                <label className="block text-sm font-medium mb-1">Wohnsituation</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.livingSituation}
                  onChange={(e) => updateField("livingSituation", e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="Mieter">Mieter</option>
                  <option value="Eigentümer">Eigentümer</option>
                  <option value="WG">WG</option>
                  <option value="bei den Eltern">Bei den Eltern</option>
                  <option value="andere">Andere</option>
                </select>
              </div>

              {/* Beruf */}
              <div>
                <label className="block text-sm font-medium mb-1">Beruf</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}           
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: Kontakt */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">Kontakt</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <div className="flex gap-2">
                  <select
                    className="border p-2 rounded w-24"
                    value={form.mobileCode}
                    onChange={(e) => updateField("mobileCode", e.target.value)}
                  >
                    <option value="+41">+41</option>
                    <option value="+49">+49</option>
                    <option value="+33">+33</option>
                    <option value="+39">+39</option>
                  </select>
                  <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    value={form.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                  />
                </div>
              </div>

              {/* Geschäft */}
              <div>
                <label className="block text-sm font-medium mb-1">Telefon Geschäft</label>
                <div className="flex gap-2">
                  <select
                    className="border p-2 rounded w-24"
                    value={form.workPhoneCode}
                    onChange={(e) => updateField("workPhoneCode", e.target.value)}
                  >
                    <option value="+41">+41</option>
                    <option value="+49">+49</option>
                    <option value="+33">+33</option>
                    <option value="+39">+39</option>
                  </select>
                  <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    value={form.workPhone}
                    onChange={(e) => updateField("workPhone", e.target.value)}
                  />
                </div>
              </div>

              {/* Email Privat */}
              <div>
                <label className="block text-sm font-medium mb-1">E-Mail Privat</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="name"
                    className="border p-2 rounded w-1/2"
                    value={form.privateEmailPart1}
                    onChange={(e) => updateField("privateEmailPart1", e.target.value)}
                  />
                  <span>@</span>
                  <input
                    type="text"
                    placeholder="domain.ch"
                    className="border p-2 rounded w-1/2"
                    value={form.privateEmailPart2}
                    onChange={(e) => updateField("privateEmailPart2", e.target.value)}
                  />
                </div>
              </div>

              {/* Email Geschäft */}
              <div>
                <label className="block text-sm font-medium mb-1">E-Mail Geschäft</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="name"
                    className="border p-2 rounded w-1/2"
                    value={form.workEmailPart1}
                    onChange={(e) => updateField("workEmailPart1", e.target.value)}
                  />
                  <span>@</span>
                  <input
                    type="text"
                    placeholder="domain.ch"
                    className="border p-2 rounded w-1/2"
                    value={form.workEmailPart2}
                    onChange={(e) => updateField("workEmailPart2", e.target.value)}
                  />
                </div>
              </div>

              {/* Empfehlung */}
              <div>
                <label className="block text-sm font-medium mb-1">Empfohlen durch</label>
                <input
                  type="text"
                  placeholder="Name Kunde"
                  className="border p-2 w-full rounded"
                  value={form.recommendation}
                  onChange={(e) => updateField("recommendation", e.target.value)}
                />
              </div>

              {/* Beziehung */}
              <div>
                <label className="block text-sm font-medium mb-1">Beziehung zum Empfehlungsgeber</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.relationToRecommender}
                  onChange={(e) => updateField("relationToRecommender", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Speichert..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
