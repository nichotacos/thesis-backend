import cron from 'node-cron';
import User from '../models/Users.js';


function resetWeeklyExp() {
    cron.schedule('0 0 * * 1', async () => {
        console.log('Resetting weekly exp...');
        await User.updateMany({}, { weeklyExp: 0 });
    }, {
        timezone: "Asia/Jakarta"
    });
}

export default resetWeeklyExp;