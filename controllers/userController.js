import User from "../models/Users.js";
import bcrypt from "bcrypt";
import { verifyCaptcha } from "../utils/verifyCaptcha.js";
import Level from "../models/Level.js";
import Module from "../models/Module.js";
import getDayDifference from "../utils/getDayDifference.js";
import ShopItem from "../models/ShopItem.js";

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
        const { username, userFullName, email, password, passwordConfirmation, captchaToken } = req.body;

        if (!username || !userFullName || !email || !password || !passwordConfirmation) {
            return res.status(400).json({ message: "Seluruh kolom wajib diisi" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username telah digunakan" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email telah digunakan" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Kata sandi harus lebih dari 6 karakter" });
        }

        if (password !== passwordConfirmation) {
            return res.status(400).json({ message: "Kata sandi tidak sesuai" });
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

export async function updateUser(req, res) {
    const { userId, username, userFullName, email } = req.body;

    console.log("Updating user with ID:", userId, "Username:", username, "Full Name:", userFullName, "Email:", email);

    if (!userId || !username || !userFullName || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, userFullName, email },
            { updatedAt: new Date() },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error });
    }
}

export async function updateUserProfilePicture(req, res) {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const imageUrl = req.file ? req.file.path : null;
        if (!imageUrl) {
            return res.status(400).json({ message: "Image file is required" });
        }

        console.log("Updating profile picture for user:", userId, "with image URL:", imageUrl);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: imageUrl },
            { new: true, updatedAt: new Date() }
        );

        return res.status(200).json({
            message: "Berhasil mengupdate foto profil",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating profile picture", error });
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
        const diffInDays = getDayDifference(lastActivity, now);

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

        const alreadyCompleted = user.completedModules.find((m) => m.module.toString() === moduleId);

        if (alreadyCompleted) {
            if (score > alreadyCompleted.score) {
                alreadyCompleted.score = score;
                alreadyCompleted.correctCount = correctCount;
            }

            alreadyCompleted.totalAnswers = totalAnswers;
            alreadyCompleted.completedAt = new Date();
        } else {
            user.completedModules.push({
                module: moduleId,
                correctCount,
                score,
                totalAnswers,
                completedAt: new Date(),
            });

            const nextModule = await Module.findOne({
                level: user.currentLearnLevel,
                index: module.index + 1
            });

            if (nextModule) {
                user.currentModule = nextModule;
            } else {
                const allLevels = await Level.find({}).sort({ index: 1 });
                const levelCount = allLevels.length;
                const userCurrentLevelIndex = allLevels.findIndex(level => level._id.toString() === user.currentLearnLevel.toString());

                if (allLevels[levelCount - 1]._id === user.currentLearnLevel.toString()) {
                    return res.status(404).json({ message: "No more levels available" });
                }

                user.currentLearnLevel = allLevels[userCurrentLevelIndex + 1]._id;
                user.currentModule = await Module.findOne({
                    level: allLevels[userCurrentLevelIndex + 1]._id,
                    index: 1
                });
            }

        }

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

export async function buyShopItem(req, res) {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ message: "User ID and Item ID are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const item = await ShopItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const alreadyPurchased = user.purchases.find((purchase) => purchase.item.toString() === itemId);

        if (alreadyPurchased) {
            return res.status(400).json({ message: "Item already purchased" });
        }

        if (user.totalGems < item.price) {
            return res.status(400).json({ message: "Not enough gems to buy this item" });
        }

        user.totalGems -= item.price;
        user.purchases.push({
            item: item._id,
            purchasedAt: new Date(),
        });

        await user.save();

        return res.status(200).json({ message: "Item bought successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error buying item", error });
    }
}

export async function equipShopItem(req, res) {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ message: "User ID and Item ID are required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const item = await ShopItem.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        console.log("Equipping item:", itemId, "for user:", userId);

        const alreadyEquipped = user.profilePicture === item.image;

        if (alreadyEquipped) {
            return res.status(400).json({ message: "Item already equipped" });
        }

        const alreadyPurchased = user.purchases.find((purchase) => purchase.item.toString() === itemId);

        if (!alreadyPurchased) {
            return res.status(400).json({ message: "Item not purchased" });
        }

        user.profilePicture = item.image;

        await user.save();

        return res.status(200).json({ message: "Item equipped successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error equipping item", error });
    }
}