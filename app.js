import { configDotenv } from "dotenv";
import express, { json } from "express";
import mongoose from "mongoose";

configDotenv({
    path: "./.env.local",
})

const app = express();
app.use(json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
})