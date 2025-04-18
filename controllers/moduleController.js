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
        const levels = await Level.find({ _id: { $in: levelIds } }).lean();
        console.log('levls', levels)

        const levelMap = new Map(levels.map(level => [level._id.toString(), level]));

        const invalidModulesWithLevel = modules.filter((m) => {
            if (!levelMap.has(m.level.toString())) {
                return true;
            }
            return false;
        });

        if (invalidModulesWithLevel.length > 0) {
            return res.status(400).json({ message: 'Some levels do not exist.' });
        }

        const createdModules = await Module.insertMany(modules);

        res.status(201).json({
            message: 'Modules created successfully',
            data: createdModules
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating modules', error: error.message });
    }
}