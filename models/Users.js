import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    userFullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Visitor'],
        required: true,
    },
    totalExp: {
        type: Number,
        default: 0,
    },
    weeklyExp: {
        type: Number,
        default: 0,
    },
    dailyExp: {
        type: Number,
        default: 0,
    },
    streak: {
        streakCount: {
            type: Number,
            default: 0,
        },
        highestStreak: {
            type: Number,
            default: 0,
        },
        lastActivity: {
            type: Date,
            default: null,
        }
    },
    totalGems: {
        type: Number,
        default: 0,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    currentLevel: {
        type: Number,
        default: 1,
    },
    currentLearnLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        default: null,
    },
    currentModule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        default: null,
    },
    hearts: {
        current: {
            type: Number,
            default: 5,
        },
        lostAt: {
            type: [Date],
            default: [],
        }
    },
    completedModules: [
        {
            module: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Module",
            },
            correctCount: {
                type: Number,
                default: 0,
            },
            totalAnswers: {
                type: Number,
                default: 0,
            },
            score: {
                type: Number,
                default: 0,
            },
            completedAt: {
                type: Date,
                default: Date.now(),
            },
        }
    ],
    isAbleToClaimDailyReward: {
        type: Boolean,
        default: false,
    },
    lastDailyRewardClaim: {
        type: Date,
        default: null,
    },
    hasClaimedDailyReward: {
        type: Boolean,
        default: false,
    },
    achievements: [{
        achievement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Achievement',
            required: true,
        },
        progress: {
            type: Number,
            default: 0
        },
        unlockedAt: {
            type: Date,
            default: null
        }
    }],
    previousLeaderboardRank: {
        type: Number,
        default: 0,
    },
    top3Count: {
        type: Number,
        default: 0,
    },
    purchases: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShopItem'
        },
        purchasedAt: {
            type: Date,
            default: Date.now
        }
    }],
    activeBoost: {
        boostType: {
            type: String,
            enum: ['boost'],
            default: null
        },
        startedAt: {
            type: Date,
            default: null
        },
        expiresAt: {
            type: Date,
            default: null
        }
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;