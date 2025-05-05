import cron from 'node-cron';
import User from '../models/Users.js';

function resetAbleClaimDailyReward() {
    cron.schedule('0 0 * * *', async () => {
        console.log('Resetting ableClaimDailyReward...');
        await User.updateMany({}, { hasClaimedDailyReward: false, isAbleToClaimDailyReward: false });
    }, {
        timezone: "Asia/Jakarta"
    });
}

export default resetAbleClaimDailyReward;