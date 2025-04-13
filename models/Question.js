import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        required: true,
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true,
    },
    type: {
        type: String,
        enum: ["MCQ", "FIB", "TF"], // Multiple Choice Question, Fill in the Blank, True/False
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    media: {
        audioUrl: {
            type: String,
            default: null,
        },
        imageUrl: {
            type: String,
            default: null,
        },
    },
    options: [{
        optionText: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            default: false,
        },
    }],
    answer: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        default: null,
    },
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

export default Question;