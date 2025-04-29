import User from "../models/Users.js";
import bcrypt from "bcrypt";
import { verifyCaptcha } from "../utils/verifyCaptcha.js";
import Level from "../models/Level.js";
import Module from "../models/Module.js";
import getDayDifference from "../utils/getDayDifference.js";

export async function fetchUsers(req, res) {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        const totalUser = await User.countDocuments();
        res.status(200).json({
            users: users,
            totalUser: totalUser,
            message: "Users fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}

export async function storeUser(req, res) {
    try {
        console.log("Request body:", req.body);
        const { username, userFullName, email, password, captchaToken } = req.body;

        if (!username || !userFullName || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // const isHuman = await verifyCaptcha(captchaToken);

        // if (!isHuman) {
        //     return res.status(400).json({ message: "Verifikasi Captcha gagal!" });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);
        const firstLevel = await Level.findOne({ name: "Bali" });
        const firstModule = await Module.findOne({ level: firstLevel._id, index: 1 });
        const userFirstName = userFullName.split(" ")[0];
        const profilePicture = `https://ui-avatars.com/api/?name=${userFirstName}&background=A60000&color=fff`;

        const newUser = new User({
            username,
            userFullName,
            email,
            hashedPassword,
            currentLearnLevel: firstLevel._id,
            currentModule: firstModule._id,
            profilePicture,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error storing user", error });
    }
}

export async function addUserExp(req, res) {
    const { userId, exp } = req.body;

    if (!userId || typeof exp !== "number") {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.dailyExp += exp;
        user.weeklyExp += exp;
        user.totalExp += exp;

        await user.save();

        return res.status(200).json({ message: "Experience points added successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error adding experience points", error });

    }
}

async function addUserExpWithoutReqRes(userId, exp) {
    if (!userId || typeof exp !== "number") {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.dailyExp += exp;
        user.weeklyExp += exp;
        user.totalExp += exp;

        await user.save();
    } catch (error) {
        return res.status(500).json({ message: "Error adding experience points", error });
    }
}

export async function getWeeklyLeaderboard(req, res) {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const users = await User.find()
            .sort({ weeklyExp: -1 })
            .limit(10)
            .lean();

        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }

        const currentUserIndex = users.findIndex(user => user._id.toString() === userId);
        const userRank = currentUserIndex !== -1 ? currentUserIndex + 1 : 0;

        if (userRank === 0) {
            return res.status(404).json({ message: "User not found in leaderboard" });
        }

        res.status(200).json({
            users,
            currentUser: {
                currentUserData: users[currentUserIndex],
                rank: userRank,
            },
            message: "Weekly leaderboard fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching weekly leaderboard:", error);
    }
}

export async function loseHeart(req, res) {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.hearts.current > 0) {
            user.hearts.current -= 1;
            user.hearts.lostAt.push(new Date());
            await user.save();
            return res.status(200).json({ message: "HP lost successfully", user });
        } else {
            return res.status(400).json({ message: "No HP left to lose" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error losing HP", error });
    }
}

export async function buyHeart(req, res) {
    const { userId, amount } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const MAX_HP = 5;
        const HP_PRICE = 50;
        const totalPrice = amount * HP_PRICE;

        if (user.totalGems < totalPrice) {
            return res.status(400).json({ message: "Berlian anda kurang untuk melakukan pembelian" });
        }

        const availableSlot = MAX_HP - user.hearts.current;
        const actualToAdd = Math.min(availableSlot, amount);

        user.hearts.lostAt.splice(0, actualToAdd);
        user.hearts.current += actualToAdd;
        user.totalGems -= totalPrice;

        await user.save();
        return res.status(200).json({ message: "HP bought successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error buying HP", error });
    }
}

async function updateStreak(user) {
    const now = new Date();
    const lastActivity = user.streak.lastActivity ? new Date(user.streak.lastActivity) : null;

    if (!lastActivity) {
        user.streak = {
            streakCount: 1,
            highestStreak: 1,
            lastActivity: now,
        };
    } else {
        const diffInDays = getDayDifference(now, lastActivity);

        if (diffInDays === 1) {
            user.streak.streakCount += 1;
            user.streak.lastActivity = now;
        } else if (diffInDays > 1) {
            user.streak.streakCount = 1;
            user.streak.lastActivity = now;
        }

        if (user.streak.streakCount > user.streak.highestStreak) {
            user.streak.highestStreak = user.streak.streakCount;
        }
    }

    console.log("Streak updated:", user.streak);

    await user.save();
}

export async function completeModule(req, res) {
    try {
        const { userId, moduleId, correctCount, score, totalAnswers } = req.body;

        if (!userId || !moduleId) {
            return res.status(400).json({ message: "User ID and Module ID are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        const alreadyCompleted = user.completedModules.some((m) =>
            m.module.toString() === moduleId.toString()
        );

        if (alreadyCompleted) {
            // Update the completed module with the new completion date
        }

        user.completedModules.push({
            module: moduleId,
            correctCount,
            score,
            totalAnswers,
            completedAt: new Date(),
        });

        console.log("Completed Modules:", user.completedModules);

        user.isAbleToClaimDailyReward = true;

        await user.save();
        await updateStreak(user);
        await addUserExpWithoutReqRes(userId, correctCount * 5);

        res.status(200).json({ message: "Module completed successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error completing module", error });
    }
}

export async function addGems(req, res) {
    const { userId, gemsAmount } = req.body;

    if (!userId || typeof gemsAmount !== "number") {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.totalGems += gemsAmount;
        await user.save();

        return res.status(200).json({ message: "Gems added successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error adding gems", error });
    }
}

export async function claimDailyReward(req, res) {
    const { userId, gems } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (gems && typeof gems !== "number") {
        return res.status(400).json({ message: "Invalid gems amount" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.hasClaimedDailyReward) {
            return res.status(400).json({ message: "Daily reward already claimed" });
        }

        if (!user.isAbleToClaimDailyReward) {
            return res.status(400).json({ message: "Not eligible to claim daily reward" });
        }

        const now = new Date();

        user.lastDailyRewardClaim = now;
        user.hasClaimedDailyReward = true;
        user.totalGems += gems || 0;
        user.isAbleToClaimDailyReward = false;

        await user.save();

        return res.status(200).json({
            message: "Daily reward claimed successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error claiming daily reward", error });
    }
}