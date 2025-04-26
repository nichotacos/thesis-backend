import { configDotenv } from "dotenv";
import express, { json } from "express";
import mongoose from "mongoose";

// Import routes
import userRoutes from "./routes/UserRoute.js";
import authRoutes from "./routes/authRoute.js";
import levelRoutes from "./routes/levelRoute.js";
import moduleRoutes from "./routes/moduleRoute.js";
import questionRoutes from "./routes/questionRoute.js";
import startCrons from "./crons/index.js";

configDotenv({
    path: "./.env.local",
})

const app = express();
app.use(json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        startCrons();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
})

app.use("/api/v1", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", levelRoutes);
app.use("/api/v1/", moduleRoutes);
app.use("/api/v1", questionRoutes);