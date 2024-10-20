import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
    CropID: String,
    user_id: String,
    CropName: String,
    ScientificName: String,
    RainFall: String,
    Temperature: String,
    Location: String,
    CropArea: String,
    SoilpHLevel: String,
    IrrigationType: String,
    Img: String,
    GrowthStage: String,
}, {
    timestamps: true
});

const Treatment = mongoose.model("Treatment", treatmentSchema);

export default Treatment;
