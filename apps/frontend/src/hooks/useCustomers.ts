import { useState, useEffect, useCallback } from "react";
import { customerService, CustomerFilter } from "../services/customer.service";
import { Customer } from "../types";

export const useCustomers = (initialFilter?: CustomerFilter) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async (filter?: CustomerFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers(filter);
      setCustomers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load customers";
      console.error("Error fetching customers:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(initialFilter);
  }, [fetchCustomers, initialFilter]);

  const deleteCustomer = async (id: number) => {
    try {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting customer:", err);
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    deleteCustomer,
  };
};
