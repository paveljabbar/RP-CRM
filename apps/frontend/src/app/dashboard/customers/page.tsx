"use client";

import { useEffect, useState, useMemo } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { Customer } from "@/types";
import { ERROR_MESSAGES } from "@/constants";
import { Button } from "@/components/ui";
import AddCustomer from "./addcustomer";
import Link from "next/link";

export default function CustomersPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [sortField, setSortField] = useState<string>("lastName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { customers, loading, refetch, deleteCustomer } = useCustomers(
    showOnlyMine ? { advisor: true } : undefined
  );

  useEffect(() => {
    refetch(showOnlyMine ? { advisor: true } : undefined);
  }, [showOnlyMine, refetch]);

  const handleDelete = async (id: number) => {
    if (!confirm(ERROR_MESSAGES.DELETE_CONFIRM)) return;

    try {
      await deleteCustomer(id);
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert(ERROR_MESSAGES.DELETE_ERROR);
    }
  };

  const handleEdit = (customer: Customer) => {
    console.log("Edit:", customer);
    alert(`Bearbeiten von Kunde: ${customer.firstName} ${customer.lastName}`);
  };

  const filteredAndSortedCustomers = useMemo(() => {
    return [...customers]
      .filter((c) => {
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        const aVal = (a[sortField as keyof Customer] || "").toString().toLowerCase();
        const bVal = (b[sortField as keyof Customer] || "").toString().toLowerCase();

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [customers, searchTerm, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Kundenverwaltung</h1>

        {/* Toggle: All / My Customers */}
        <div className="flex gap-3 mb-4">
          <Button
            onClick={() => setShowOnlyMine(false)}
            variant={!showOnlyMine ? "primary" : "secondary"}
          >
            Alle Kunden
          </Button>
          <Button
            onClick={() => setShowOnlyMine(true)}
            variant={showOnlyMine ? "primary" : "secondary"}
          >
            Meine Kunden
          </Button>
        </div>

        {/* Search + New Customer */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Suche nach Name..."
            className="border rounded px-3 py-2 text-sm w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setShowModal(true)}>+ Neuer Kunde</Button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Laden...</div>
        ) : (
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
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{col.label}</span>
                      {sortField === col.key && (
                        <span>{sortOrder === "asc" ? "🔼" : "🔽"}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-3 bg-gray-200 text-gray-700 font-semibold">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Keine Kunden vorhanden
                  </td>
                </tr>
              ) : (
                filteredAndSortedCustomers.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer">
                      <Link href={`/dashboard/customers/${c.id}`}>
                        {c.lastName || "-"}, {c.firstName || "-"}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-700">
                      {c.privateEmailPart1 && c.privateEmailPart2
                        ? `${c.privateEmailPart1}@${c.privateEmailPart2}`
                        : "-"}
                    </td>
                    <td className="p-3 text-gray-700">{c.street || "-"}</td>
                    <td className="p-3 text-gray-700">{c.zip || "-"}</td>
                    <td className="p-3 text-gray-700">{c.city || "-"}</td>
                    <td className="p-3 text-gray-700">
                      {c.advisor ? c.advisor.name || c.advisor.email : "-"}
                    </td>
                    <td className="p-3 text-gray-700">{c.user?.name || "-"}</td>
                    <td className="p-3 flex gap-2">
                      <Button
                        onClick={() => handleEdit(c)}
                        variant="warning"
                        className="px-3 py-1 text-sm"
                      >
                        ✏️
                      </Button>
                      <Button
                        onClick={() => handleDelete(c.id)}
                        variant="danger"
                        className="px-3 py-1 text-sm"
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddCustomer
          onClose={() => setShowModal(false)}
          onCustomerAdded={() => {
            setShowModal(false);
            refetch(showOnlyMine ? { advisor: true } : undefined);
          }}
        />
      )}
    </main>
  );
}
