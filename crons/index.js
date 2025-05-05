import regenerateHeart from "./regenerateHeart.js";
import resetAbleClaimDailyReward from "./resetAbleClaimDailyReward.js";
import resetDailyExp from "./resetDailyExp.js";
import resetWeeklyExp from "./resetWeeklyExp.js";

function startCrons() {
    resetDailyExp();
    resetWeeklyExp();
    regenerateHeart();
    resetAbleClaimDailyReward();
}

export default startCrons;