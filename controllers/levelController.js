import Level from "../models/Level.js";

export async function getLevels(req, res) {
    try {
        const levels = await Level.find().populate('modules');
        if (!levels) {
            return res.status(404).json({ message: "No levels found" });
        }
        res.status(200).json({
            levels: levels,
            message: "Levels fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels", error });
    }
}

export async function createLevel(req, res) {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newLevel = new Level({
            name,
            description,
        });

        await newLevel.save();
        res.status(201).json({
            level: newLevel,
            message: "Level created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating level", error });
    }
}