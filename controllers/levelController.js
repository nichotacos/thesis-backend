import Level from "../models/Level.js";

export async function getLevels(req, res) {
    try {
        const levels = await Level.aggregate([
            {
                $lookup: {
                    from: 'modules',
                    localField: '_id',
                    foreignField: 'level',
                    as: 'modules'
                }
            }
        ])
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
        const { name, actualBipaLevel, description } = req.body;

        if (!name || !actualBipaLevel || !description) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        const imageUrl = req.file.path;

        const newLevel = new Level({
            name,
            actualBipaLevel,
            description,
            level_image: imageUrl,
        })

        await newLevel.save();

        res.status(201).json({
            message: 'Level created successfully',
            data: newLevel,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating level", error });
    }
}