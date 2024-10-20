// import mongoose from "mongoose";

// const reportSchema = new mongoose.Schema({
//     user_id: String,
//     test_type: String,
//     test_name: String,
//     date: String,
//     comments: String,
// }, {
//     timestamps: true
// });

// const Report = mongoose.model("Report", reportSchema);

// export default Report;

import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    CropID: String,
    user_id: String,
    CropName: String,
    ScientificName: String,
    Location: String,
    CropArea: String,
    SoilpHLevel: String,
    IrrigationType: String,
    Img: String,
    GrowthStage: String,
    SoilType: String,
    RainFall: String,
    Temperature: String,
}, {
    timestamps: true
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
