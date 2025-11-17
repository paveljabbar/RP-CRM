import apiClient from "../lib/apiClient";
import { ROUTES } from "../constants";
import { Customer } from "../types";

export interface CustomerFilter {
  advisor?: boolean;
}

export const customerService = {
  /**
   * Get all customers with optional filtering
   */
  async getCustomers(filter?: CustomerFilter): Promise<Customer[]> {
    const params = new URLSearchParams();
    if (filter?.advisor) {
      params.append("advisor", "true");
    }
    
    const url = `${ROUTES.CUSTOMERS.BASE}${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<Customer[]>(url);
    return response.data;
  },

  /**
   * Get customer by ID
   */
  async getCustomerById(id: number): Promise<Customer> {
    const response = await apiClient.get<Customer>(ROUTES.CUSTOMERS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new customer
   */
  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.post<Customer>(ROUTES.CUSTOMERS.BASE, data);
    return response.data;
  },

  /**
   * Update customer
   */
  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.put<Customer>(ROUTES.CUSTOMERS.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete customer (soft delete)
   */
  async deleteCustomer(id: number): Promise<void> {
    await apiClient.delete(ROUTES.CUSTOMERS.BY_ID(id));
  },
};
