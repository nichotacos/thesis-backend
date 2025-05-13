import cron from 'node-cron';
import User from '../models/Users.js';


function resetWeeklyExp() {
    cron.schedule('0 0 * * 1', async () => {
        console.log('Resetting weekly exp...');
        const weeklyLeaderBoard = await User.find({}).sort({ weeklyExp: -1 });
        const weeklyExp = weeklyLeaderBoard.map((user, index) => {
            return {
                userId: user._id,
                rank: index + 1,
                exp: user.weeklyExp
            };
        });
        weeklyExp.forEach(async (user) => {
            await User.findByIdAndUpdate(user.userId, {
                weeklyExp: 0,
                previousLeaderboardRank: user.rank,
                top3Count: user.rank <= 3 ? user.top3Count + 1 : user.top3Count,
            });
        });
    }, {
        timezone: "Asia/Jakarta"
    });
}

export default resetWeeklyExp;