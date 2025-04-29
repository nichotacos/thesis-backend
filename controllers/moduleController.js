import Level from "../models/Level.js";
import Module from "../models/Module.js";

export async function getModules(req, res) {
    try {
        const { levelIds } = req.body;

        if (!levelIds || !Array.isArray(levelIds) || levelIds.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of levelIds.' });
        }

        const modules = await Module.find({ level: { $in: levelIds } }).populate('level').lean();

        res.status(200).json({
            message: 'Modules fetched successfully',
            data: modules
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching modules', error: error.message });
    }
}

export async function createModule(req, res) {
    try {
        const { modules } = req.body;
        console.log(modules);

        if (!modules || modules.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of modules.' });
        }

        const invalidModules = modules.filter((m) =>
            !m.name || !m.name.trim() ||
            !m.description || !m.description.trim() ||
            !m.level || !m.level.trim()
        );

        if (invalidModules.length > 0) {
            return res.status(400).json({ message: 'Please fill all fields!' });
        }

        const levelIds = modules.map(m => m.level);
        const uniqueLevelIds = [...new Set(levelIds)];

        // Fetch levels
        const levels = await Level.find({ _id: { $in: uniqueLevelIds } }).lean();
        const levelMap = new Map(levels.map(level => [level._id.toString(), level]));

        const invalidModulesWithLevel = modules.filter((m) => !levelMap.has(m.level.toString()));
        if (invalidModulesWithLevel.length > 0) {
            return res.status(400).json({ message: 'Some levels do not exist.' });
        }

        // Step 1: Get current highest index for each level
        const latestIndexes = {};
        for (const levelId of uniqueLevelIds) {
            const latestModule = await Module.findOne({ level: levelId })
                .sort({ index: -1 }) // Get the one with highest index
                .lean();

            latestIndexes[levelId] = latestModule ? latestModule.index : 0;
        }

        // Step 2: Assign indexes
        const modulesWithIndex = modules.map((m) => {
            const currentLastIndex = latestIndexes[m.level] || 0;
            latestIndexes[m.level] = currentLastIndex + 1; // Update the latest index for this level
            return {
                ...m,
                index: latestIndexes[m.level],
            };
        });

        // Step 3: Create modules
        const createdModules = await Module.insertMany(modulesWithIndex);

        res.status(201).json({
            message: 'Modules created successfully',
            data: createdModules
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating modules', error: error.message });
    }
}
