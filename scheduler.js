import cron from "node-cron";
import { fetchAndStoreNews } from "./services/news.service.js"; // Your news fetching function

// 🕒 Schedule the task to run every hour
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running crypto news fetcher at", new Date().toLocaleString());
  try {
    await fetchAndStoreNews();
    console.log("✅ Crypto news updated successfully.");
  } catch (err) {
    console.error("❌ Failed to update crypto news:", err.message);
  }
});

console.log("📝 Crypto news scheduler started...");
