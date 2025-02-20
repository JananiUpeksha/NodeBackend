import express from "express";
import {getAllOrders, OrderAdd} from "../database/order-client";
import {Order} from "../model/order";

const router = express.Router();


// save order
router.post("/add", async (req, res) => {
    const order: Order = req.body;
    console.log("Order : ", order)

    try {
        const addedOrder = await OrderAdd(order);
        res.send(addedOrder);
    } catch (error) {
        console.log("Error adding order : ", error);
        res.status(400).json({ error: "Error adding order" });
    }
})


// get all orders
router.get("/view", async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch(error){
        console.log("Error getting orders : ", error);
    }
})


export default router;