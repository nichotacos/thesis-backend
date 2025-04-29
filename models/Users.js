import mongoose from "mongoose";
import Level from "./Level.js";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    userFullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    totalExp: {
        type: Number,
        default: 0,
    },
    weeklyExp: {
        type: Number,
        default: 0,
    },
    dailyExp: {
        type: Number,
        default: 0,
    },
    totalStreak: {
        type: Number,
        default: 0,
    },
    highestStreak: {
        type: Number,
        default: 0,
    },
    totalGems: {
        type: Number,
        default: 0,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    currentLevel: {
        type: Number,
        default: 1,
    },
    currentLearnLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        default: null,
    },
    currentModule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        default: null,
    },
    hearts: {
        current: {
            type: Number,
            default: 5,
        },
        lostAt: {
            type: [Date],
            default: [],
        }
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;