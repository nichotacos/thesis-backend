import resetDailyExp from "./resetDailyExp.js";
import resetWeeklyExp from "./resetWeeklyExp.js";

function startCrons() {
    resetDailyExp();
    resetWeeklyExp();
}

export default startCrons;