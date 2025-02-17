import { PrismaClient } from '@prisma/client';
import { Customer } from "../model/customer";

const prisma = new PrismaClient();

// Save customer
export async function CustomerAdd(c: Customer) {
    try {
        const newCustomer = await prisma.customer.create({
            data: {
                customer_firstName: c.customer_firstName,
                customer_lastName: c.customer_lastName,
                customer_phone: c.customer_phone, // Changed from customer_contact to customer_phone
                customer_email: c.customer_email,
                customer_address: c.customer_address,
                gender: c.gender,
            }
        });
        console.log("Customer Added:", newCustomer);
        return newCustomer;
    } catch (error) {
        console.log("Error adding customer:", error);
        return null;
    }
}

// Update customer
export async function CustomerUpdate(customerId: number, c: Partial<Customer>) {
    try {
        // Ensure the customer exists before updating
        const existingCustomer = await prisma.customer.findUnique({
            where: { customer_id: customerId }
        });

        if (!existingCustomer) {
            console.warn("Customer not found:", customerId);
            return null;
        }

        const updatedCustomer = await prisma.customer.update({
            where: { customer_id: customerId },
            data: {
                customer_firstName: c.customer_firstName,
                customer_lastName: c.customer_lastName,
                customer_phone: c.customer_phone, // Changed from customer_contact to customer_phone
                customer_email: c.customer_email,
                customer_address: c.customer_address,
                gender: c.gender,
            }
        });

        console.log("Customer updated:", updatedCustomer);
        return updatedCustomer;
    } catch (error) {
        console.error("Error updating customer:", error);
        return null;
    }
}

// Delete customer
export async function CustomerDelete(customerId: number) {
    try {
        // Check if the customer exists before deleting
        const customerExists = await prisma.customer.findUnique({
            where: { customer_id: customerId },
        });

        if (!customerExists) {
            throw new Error("Customer not found");
        }

        const deletedCustomer = await prisma.customer.delete({
            where: { customer_id: customerId },
        });

        console.log("Customer deleted:", customerId);
        return deletedCustomer;
    } catch (error) {
        console.error("Error deleting customer:", error);
        throw new Error("Failed to delete customer");
    }
}

// Get all customers
export async function getAllCustomers() {
    try {
        return await prisma.customer.findMany();
    } catch (error) {
        console.log("Error getting customers:", error);
    }
}
