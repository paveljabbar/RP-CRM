import { prisma } from "../lib/prisma";
import { ERROR_MESSAGES } from "../constants/messages";
import { Customer, Prisma } from "@prisma/client";

export interface CustomerCreateData {
  category?: string;
  advisorId?: number;
  language?: string;
  noContact?: boolean;
  gender?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  maritalStatus?: string;
  birthDate?: string;
  ahvNumber?: string;
  nationality?: string;
  foreignPermit?: string;
  street?: string;
  zip?: number;
  city?: string;
  livingSituation?: string;
  occupation?: string;
  mobileCode?: string;
  mobile?: string;
  workPhoneCode?: string;
  workPhone?: string;
  privateEmailPart1?: string;
  privateEmailPart2?: string;
  workEmailPart1?: string;
  workEmailPart2?: string;
  recommendation?: string;
  relationToRecommender?: string;
  userId: number;
}

export interface CustomerFilter {
  deleted?: boolean;
  advisorId?: number;
}

export class CustomerService {
  /**
   * Get all customers with optional filtering
   */
  async getCustomers(filter: CustomerFilter = { deleted: false }) {
    const where: Prisma.CustomerWhereInput = {};

    if (filter.deleted !== undefined) {
      where.deleted = filter.deleted;
    }

    if (filter.advisorId) {
      where.advisorId = filter.advisorId;
    }

    return prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        advisor: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: number) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        advisor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!customer) {
      throw new Error(ERROR_MESSAGES.CUSTOMER_NOT_FOUND);
    }

    return customer;
  }

  /**
   * Create a new customer
   */
  async createCustomer(data: CustomerCreateData) {
    // Check if AHV number already exists
    if (data.ahvNumber) {
      const existing = await prisma.customer.findUnique({
        where: { ahvNumber: data.ahvNumber },
      });
      if (existing) {
        throw new Error(ERROR_MESSAGES.AHV_EXISTS);
      }
    }

    // Prepare advisor connection
    const advisorConnect =
      data.advisorId && data.advisorId > 0
        ? { connect: { id: data.advisorId } }
        : undefined;

    const customer = await prisma.customer.create({
      data: {
        category: data.category,
        language: data.language,
        noContact: data.noContact,
        gender: data.gender,
        salutation: data.salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        maritalStatus: data.maritalStatus,
        birthDate: data.birthDate,
        ahvNumber: data.ahvNumber,
        nationality: data.nationality,
        foreignPermit: data.foreignPermit,
        street: data.street,
        zip: data.zip,
        city: data.city,
        livingSituation: data.livingSituation,
        occupation: data.occupation,
        mobileCode: data.mobileCode,
        mobile: data.mobile,
        workPhoneCode: data.workPhoneCode,
        workPhone: data.workPhone,
        privateEmailPart1: data.privateEmailPart1,
        privateEmailPart2: data.privateEmailPart2,
        workEmailPart1: data.workEmailPart1,
        workEmailPart2: data.workEmailPart2,
        recommendation: data.recommendation,
        relationToRecommender: data.relationToRecommender,
        advisor: advisorConnect,
        user: { connect: { id: data.userId } },
      },
    });

    return customer;
  }

  /**
   * Update customer
   */
  async updateCustomer(id: number, data: Partial<CustomerCreateData>) {
    // Check if customer exists
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(ERROR_MESSAGES.CUSTOMER_NOT_FOUND);
    }

    // Check if advisor exists
    if (data.advisorId) {
      const advisorExists = await prisma.user.findUnique({
        where: { id: data.advisorId },
      });

      if (!advisorExists) {
        throw new Error(ERROR_MESSAGES.ADVISOR_NOT_FOUND);
      }
    }

    // Prepare update data
    const { advisorId, userId, ...restData } = data;
    
    const updateData: any = { ...restData };
    
    if (advisorId !== undefined) {
      updateData.advisor = advisorId ? { connect: { id: advisorId } } : { disconnect: true };
    }
    
    if (userId) {
      updateData.user = { connect: { id: userId } };
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        advisor: { select: { id: true, name: true, email: true } },
      },
    });

    return updated;
  }

  /**
   * Soft delete customer
   */
  async deleteCustomer(id: number) {
    await prisma.customer.update({
      where: { id },
      data: { deleted: true },
    });
  }
}

export const customerService = new CustomerService();
