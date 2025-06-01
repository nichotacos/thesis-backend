import { Achievement } from "../models/Achievement.js";
import User from "../models/Users.js";

export const createAchievement = async (req, res) => {
    try {
        const { code, title, description, category, rarity, reward, progress, maxProgress } = req.body;

        if (!code || !title || !description || !category || !rarity || !reward, !progress, !maxProgress) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        const badge = req.file.path;

        if (!badge) {
            return res.status(400).json({ message: "Badge image is required" });
        }

        const achievementData = {
            code,
            title,
            description,
            category,
            rarity,
            badge,
            reward,
            progress,
            maxProgress
        }

        const createdAchievement = await Achievement.create(achievementData);

        res.status(201).json({
            message: 'Achievement created successfully',
            data: createdAchievement,
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

export const grantAchievement = async (req, res) => {
    try {
        const { userId, achievementCode } = req.body;
        console.log(userId, achievementCode);

        if (!userId || !achievementCode) {
            return res.status(400).json({ message: "User ID and achievement code are required" });
        }

        const user = await User.findById(userId).populate("achievements.achievement");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const achievement = await Achievement.findOne({ code: achievementCode });

        if (!achievement) {
            return res.status(404).json({ message: "Achievement not found" });
        }

        const grantedAchievement = user.achievements.find(a => a.achievement.code === achievementCode);

        if (grantedAchievement) {
            if (grantedAchievement.unlockedAt) return;

            grantedAchievement.progress += 1;

            if (grantedAchievement.progress >= achievement.maxProgress) {
                grantedAchievement.progress = achievement.maxProgress;
                grantedAchievement.unlockedAt = new Date();

                user.totalGems += achievement.reward.gems || 0;
            }
        } else {
            const newAchievement = {
                achievement: achievement._id,
                progress: 1,
                unlockedAt: 1 >= achievement.maxProgress ? new Date() : null
            }

            if (newAchievement.unlockedAt) {
                user.totalGems += achievement.reward.gems || 0;
            }

            user.achievements.push(newAchievement);
        }

        await user.save();

        console.log(user.achievements, user.totalGems);

        res.status(200).json({
            message: `Achievement ${achievement.title} granted to user ${userId}`,
            data: achievement
        });
    } catch (error) {
        console.error("Error granting achievement:", error);
        res.status(500).json({ message: "Error granting achievement", error });
    }
}