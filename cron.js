import cron from 'node-cron';

import { saveOptionsCron } from "./nse.js";

// Helper to check if current time is between 9:30 AM and 3:30 PM
function isWithinMarketHours() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 9 * 60 + 30;  // 9:30 AM = 570
  const endMinutes = 15 * 60 + 35;   // 3:30 PM = 930

  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
}

function startCron() {
console.log("Cron job started...");
// Cron job: runs every minute
cron.schedule('* * * * *', () => {
  if (isWithinMarketHours()) {
    console.log(`[${new Date().toLocaleTimeString()}] Job running within market hours...`);
    // Place your code here, e.g., fetch data from NSE
    saveOptionsCron();
  } else {
    console.log(`[${new Date().toLocaleTimeString()}] Outside market hours. Skipping.`);
  }
});

}
export { startCron };
