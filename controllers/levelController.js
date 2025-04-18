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
        const { levels } = req.body;

        if (!levels || levels.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of levels.' });
        }

        const invalidLevels = levels.filter((l) =>
            !l.name || !l.name.trim() ||
            !l.actualBipaLevel || !l.actualBipaLevel.trim() ||
            !l.description || !l.description.trim()
        );

        if (invalidLevels.length > 0) {
            return res.status(400).json({ message: 'Please fill all fields!' });
        }

        const createdLevels = await Level.insertMany(levels);

        res.status(201).json({
            message: 'Levels created successfully',
            data: createdLevels
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating level", error });
    }
}