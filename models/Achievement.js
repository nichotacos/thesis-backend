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
    category: {
        type: String,
        required: true,
        enum: ["pembelajaran", "penguasaan", "pencapaian"],
    },
    rarity: {
        type: String,
        required: true,
        enum: ["umum", "langka", "epik", "legendaris"],
    },
    maxProgress: {
        type: Number,
        required: true,
        default: 0,
    },
    badge: {
        type: String,
        required: true,
    },
    reward: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Achievement = mongoose.model("Achievement", achievementSchema);