import express from "express";
import cors from "cors";

import {
    AddNewCrop,
    UpdateCrop,
    DeleteCrop,
    getAllCrops,
    getSingleCrops
} from "../controllers/reportController.js";

const router = express.Router();

router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

router.post("/addReport/:id", AddNewCrop);
router.get("/myReports", getAllCrops);
router.get("/myReport/:id", getSingleCrops);
router.put("/Report/update/:id", UpdateCrop)
router.delete("/Report/delete/:id", DeleteCrop);

export default router;
