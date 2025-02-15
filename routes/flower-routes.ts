import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import {Flower} from "../model/flower";
import {FlowerAdd, FlowerDelete, FlowerUpdate, getAllFlowers} from "../database/flower-client";

dotenv.config();

const router = express.Router();

// Configure Multer for file uploads (store in memory for Base64 conversion)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Save flower (with image processing)
router.post("/add", upload.single("flower_image"), async (req, res) => {
    console.log('Request body : ', req.body);
    console.log('Uploaded file : ', req.file);

    try {
        const { flower_name, flower_size, flower_colour, flower_unit_price, flower_qty_on_hand } = req.body;

        let base64Image: string = ""; // Ensure it's always a string
        if (req.file) {
            base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const flower: Flower = {
            flower_name,
            flower_image: base64Image, // No TypeScript error now
            flower_size,
            flower_colour,
            flower_unit_price: parseFloat(flower_unit_price),
            flower_qty_on_hand: parseInt(flower_qty_on_hand, 10),
        };

        const addedFlower = await FlowerAdd(flower);
        res.status(201).json(addedFlower);
    } catch (error) {
        console.log("Error adding flower: ", error);
        res.status(400).json({ error: "Error adding flower" });
    }
});

/*// Update flower (with optional image update)
router.put("/update/:flower_code", upload.single("flower_image"), async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const flowerCode: number = +req.params.flower_code;

    try {
        const { flower_name, flower_size, flower_colour, flower_unit_price, flower_qty_on_hand } = req.body;

        let base64Image: string | undefined;
        if (req.file) {
            base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const flowerUpdateData: Partial<Flower> = {
            flower_name,
            flower_size,
            flower_colour,
            flower_unit_price: parseFloat(flower_unit_price),
            flower_qty_on_hand: parseInt(flower_qty_on_hand, 10),
        };

        if (base64Image) {
            flowerUpdateData.flower_image = base64Image; // Update image only if a new one is uploaded
        }

        const updatedFlower = await FlowerUpdate(flowerCode, flowerUpdateData);

        if (updatedFlower) {
            res.json(updatedFlower);
        } else {
            res.status(404).json({ message: "Flower not found" });
        }
    } catch (error) {
        console.error("Error updating flower:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});*/
router.put("/update/:flower_code", upload.single("flower_image"), async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const flowerCode: number = +req.params.flower_code;

    try {
        const { flower_name, flower_size, flower_colour, flower_unit_price, flower_qty_on_hand } = req.body;

        let base64Image: string | undefined;
        if (req.file) {
            base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const flowerUpdateData: Partial<Flower> = {
            flower_name,
            flower_size,
            flower_colour,
            flower_unit_price: parseFloat(flower_unit_price),
            flower_qty_on_hand: parseInt(flower_qty_on_hand, 10),
        };

        if (base64Image) {
            flowerUpdateData.flower_image = base64Image; // Update image only if a new one is uploaded
        }

        const updatedFlower = await FlowerUpdate(flowerCode, flowerUpdateData);

        if (updatedFlower) {
            res.json(updatedFlower);
        } else {
            res.status(404).json({ message: "Flower not found" });
        }
    } catch (error) {
        console.error("Error updating flower:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// delete flower
router.delete("/delete/:flower_code", async (req, res) => {
    const flowerCode : number = +req.params.flower_code; // Convert string to number using +
    console.log('flowerCode : ', flowerCode)
    try {
        const deletedFlower = await FlowerDelete(flowerCode);
        res.json(deletedFlower);
    } catch(error){
        console.log("Error deleting flower : ", error);
    }
});

// get all flowers
router.get("/view", async (req, res) => {
    try {
        const flowers = await getAllFlowers();
        res.json(flowers);
    } catch(error){
        console.log("Error getting flowers : ", error);
    }
})



export default router;