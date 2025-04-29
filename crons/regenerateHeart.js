import cron from 'node-cron';
import User from '../models/Users.js';

const MAX_HP = 5;
const HP_COOLDOWN_MS = 30 * 60 * 1000;

function regenerateHeart() {
    cron.schedule('*/5 * * * *', async () => {
        try {
            const users = await User.find({ 'hearts.lostAt.0': { $exists: true } });
            const now = new Date();
            const updates = [];

            users.forEach(async (user) => {
                const regenerated = user.hearts.lostAt.filter(
                    (timestamp) => now.getTime() - new Date(timestamp).getTime() >= HP_COOLDOWN_MS
                );

                if (regenerated.length === 0) return;

                const remainingLostAt = user.hearts.lostAt.slice(regenerated.length);
                const newHpValue = Math.min(user.hearts.current + regenerated.length, MAX_HP);

                updates.push({
                    updateOne: {
                        filter: { _id: user._id },
                        update: {
                            $set: {
                                'hearts.current': newHpValue,
                                'hearts.lostAt': remainingLostAt
                            },
                        }
                    }
                });

                if (updates.length > 0) {
                    await User.bulkWrite(updates);
                    console.log(`Updated hearts for user ${user._id}: ${newHpValue} hearts remaining`);
                } else {
                    console.log(`No hearts to regenerate for user ${user._id}`);
                }
            })
        } catch (error) {
            console.error('Error regenerating hearts:', error);
        }
    })
}

export default regenerateHeart;