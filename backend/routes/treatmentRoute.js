import express from "express";
import cors from "cors";

import {
    AddNewCrop,
    UpdateCrop,
    DeleteCrop,
    getAllCrops,
    getSingleCrops
} from "../controllers/TreatmentController.js";

const router = express.Router();

router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

router.post("/addTreatment/:id", AddNewCrop);
router.get("/myTreatment", getAllCrops);
router.get("/myTreatment/:id", getSingleCrops);
router.put("/Treatment/update/:id", UpdateCrop)
router.delete("/Treatment/delete/:id", DeleteCrop);

export default router;
