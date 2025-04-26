import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        required: true,
    },
});

const Module = mongoose.model("Module", moduleSchema);

export default Module;