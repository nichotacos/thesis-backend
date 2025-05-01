import { Achievement } from "../models/Achievement.js";

export const createAchievement = async (req, res) => {
    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body];

        const missingFields = payload.some(({ code, title, description, reward }) =>
            !code || !title || !description || !reward
        );

        if (missingFields) {
            return res.status(400).json({ message: "Each achievement must include code, title, description, and reward" });
        }

        const achievements = payload.map(data => ({
            code: data.code,
            title: data.title,
            description: data.description,
            reward: {
                gems: data.reward.gems || 0,
                exp: data.reward.exp || 0,
                hp: data.reward.hp || 0
            }
        }));

        const createdAchievements = await Achievement.insertMany(achievements);

        res.status(201).json({
            message: `${createdAchievements.length} achievement(s) created successfully`,
            data: createdAchievements
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating achievements", error });
    }
};


export const getAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find().lean();

        if (!achievements) {
            return res.status(404).json({ message: "No achievements found" });
        }

        res.status(200).json({
            achievements: achievements,
            message: "Achievements fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching achievements", error });
    }
}