import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    actualBipaLevel: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // modules: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Module",
    // }],
}, { timestamps: true });

const Level = mongoose.model("Level", levelSchema);

export default Level;