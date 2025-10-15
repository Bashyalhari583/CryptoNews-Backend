// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const { fetchAndSaveEvents } = require("./controllers/event.controller");
// const { fetchEventsAndSave } = require("./services/event.service");
// const { fetchAndStoreNews } = require("./services/news.service");
// require('dotenv').config();

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const eventRoutes = require ("./routes/event.router");
// const newsRoutes = require ("./routes/news.router");

// //routes
// app.use("/api",eventRoutes);
// app.use("/api",newsRoutes);

// // Real-time update: fetch every 5 minutes
// setInterval(async () => {
//   console.log("Fetching events from CoinMarketCal (auto update)...");
//   try {
//     await fetchEventsAndSave(); // dummy req/res
//     console.log("Events auto-updated successfully");
//   } catch (err) {
//     console.error("Error auto fetching events:", err.message);
//   }
// }, 5 * 60 * 1000); // 5 minutes

// // Fetch and store news every 2 hours
// fetchAndStoreNews();
// setInterval(fetchAndStoreNews, 2 * 60 * 60 * 1000);

// const PORT = process.env.PORT || 5000;

// app.use("/", (req, res, next) => {
//   res.send(`<div
//         style="display:flex;
//                align-items:center;
//                justify-content:center;
//                height:98vh;
//                background-color: #0D1B2A;
//                 color: #E0E1DD;
//                font-size:32px;">
//             <h1> Wellcome to CryptoNews Backend </h1>
//         </div>
//         `);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port http://localhost:${PORT}`);
// });

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { fetchEventsAndSave } from "./services/event.service.js";
import { fetchAndStoreNews } from "./services/news.service.js";
import eventRoutes from "./routes/event.router.js";
import newsRoutes from "./routes/news.router.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api", eventRoutes);
app.use("/api/news", newsRoutes);

// Auto fetch events every 5 minutes
setInterval(async () => {
  console.log("⏳ Fetching events from CoinMarketCal (auto update)...");
  try {
    await fetchEventsAndSave();
    console.log("✅ Events auto-updated successfully");
  } catch (err) {
    console.error("❌ Error auto fetching events:", err.message);
  }
}, 5 * 60 * 1000);

// Auto fetch news every 5 minutes
// setInterval(async () => {
//   console.log("⏳ Fetching events from CoinMarketCal (auto update)...");
//   try {
//     await fetchAndStoreNews();
//     console.log("✅ Fetching latest crypto news...");
//   } catch (err) {
//     console.error("❌ Error auto fetching news:", err.message);
//   }
// }, 5 * 60 * 1000);

// fetchAndStoreNews();
// setInterval(fetchAndStoreNews, 2 * 60 * 60 * 1000);

//Cron Job: Fetch news every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("⏱ Cron Job: Fetching latest crypto news...");
  try {
    await fetchAndStoreNews();
    console.log("✅ Cron Job: News updated successfully.");
  } catch (err) {
    console.error("❌ Cron Job Error:", err.message);
  }
});

app.get("/", (req, res) => {
  res.send(`
    <div style="display:flex;
                align-items:center;
                justify-content:center;
                height:98vh;
                background-color:#0D1B2A;
                color:#E0E1DD;
                font-size:32px;">
      <h1>Welcome to CryptoNews Backend 🚀</h1>
    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
