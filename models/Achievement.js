import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reward: {
        type: {
            gems: Number,
        }
    },
}, { timestamps: true });

export const Achievement = mongoose.model("Achievement", achievementSchema);