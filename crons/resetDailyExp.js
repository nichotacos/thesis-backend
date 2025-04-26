import cron from 'node-cron';
import User from '../models/Users.js';


function resetDailyExp() {
    cron.schedule('0 0 * * *', async () => {
        console.log('Resetting daily exp...');
        console.log('Time', new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        await User.updateMany({}, { dailyExp: 0 });
    }, {
        timezone: "Asia/Jakarta"
    });
}

export default resetDailyExp;