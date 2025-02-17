import express from "express";
import dotenv from "dotenv";
import {Customer} from "../model/customer";
import {
    CustomerAdd,
    CustomerDelete,
    CustomerUpdate,
    getAllCustomers
} from "../database/customer-client";

dotenv.config();

const router = express.Router();

router.post("/add", async (req: express.Request<{}, {}, Customer>, res: express.Response) => {
    console.log("Request body:", req.body);

    try {
        const addedCustomer = await CustomerAdd(req.body);
        res.status(201).json(addedCustomer);
    } catch (err) {
        console.error("Error adding customer:", err);
        res.status(400).json({ error: "Error adding customer" });
    }
});


router.delete("/delete/:customer_id", async (req, res) => {
    const customerId: number = +req.params.customer_id; // Convert id to number
    try{
        const deletedCustomer = await CustomerDelete(customerId);
        res.json(deletedCustomer);
    }catch(err){
        console.log("error deleting customer", err);
    }
})

router.put("/update/:customer_id", async (req, res) => {
    const customerId: number = +req.params.customer_id; // Convert id to number
    const customer = req.body as Customer; // Type assertion

    try {
        const updatedCustomer = await CustomerUpdate(customerId, customer);
        if (updatedCustomer) {
            res.json(updatedCustomer);
        } else {
            res.status(404).json({ message: "Customer not found" });
        }
    } catch (err) {
        console.error("Error updating customer", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/view", async (req, res) => {
    try{
        const customers=  await getAllCustomers();
        res.json(customers);
    }catch(err){
        console.log("error getting customers", err);
    }
})

export default router;