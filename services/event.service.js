// const axios = require("axios");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
//   console.log("📡 Fetching all upcoming events from CoinMarketCal API...");

//   let allEvents = [];
//   let page = 1;
//   let hasMore = true;

//   while (hasMore) {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await axios.get(
//           "https://developers.coinmarketcal.com/v1/events",
//           {
//             headers: {
//               "x-api-key": process.env.COINMARKETCAL_API_KEY,
//               Accept: "application/json",
//             },
//             params: { limit: 20, page, lang: "en" },
//             timeout: 30000,
//           }
//         );

//         const events = response.data.body || response.data.events || [];
//         console.log(`✅ Page ${page} API responded with ${events.length} events`);

//         if (events.length === 0) {
//           hasMore = false;
//           break;
//         }

//         const mappedEvents = events.map((ev) => ({
//           id: ev.id,
//           title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//           description:
//             typeof ev.description === "object"
//               ? ev.description.en
//               : ev.description || "No description available",
//           date_event: ev.date_event,
//           date_added: ev.date_added,
//           proof: ev.proof || null,
//           source: ev.source || null,
//           original_source: ev.original_source || null,
//           coins: ev.coins || [],
//           categories: ev.categories || [],
//           votes: ev.votes || 0,
//           views: ev.views || 0,
//           confidence: ev.confidence || 0,
//           trending_indicator: ev.trending_indicator || false,
//           trending_score: ev.trending_score || 0,
//           popular_indicator: ev.popular_indicator || false,
//           popular_score: ev.popular_score || 0,
//           significant_indicator: ev.significant_indicator || false,
//           significant_score: ev.significant_score || 0,
//           catalyst_indicator: ev.catalyst_indicator || false,
//           catalyst_score: ev.catalyst_score || 0,
//           confirmed: ev.confirmed || false,
//         }));

//         for (const ev of mappedEvents) {
//           try {
//             await Event.upsert(ev);
//           } catch (dbErr) {
//             console.error(`❌ DB upsert failed for event ${ev.id}:`, dbErr.message);
//           }
//         }

//         allEvents.push(...mappedEvents);
//         page++; // go to next page
//         break; // exit retry loop on success

//       } catch (error) {
//         console.error(`❌ Error fetching page ${page} (attempt ${i + 1}):`, error.response?.data || error.message);
//         if (i === retries - 1) throw error;
//         console.log(`🔄 Retrying in ${delay / 1000}s...`);
//         await new Promise((res) => setTimeout(res, delay));
//       }
//     }
//   }

//   console.log(`💾 Total saved events: ${allEvents.length}`);
//   return allEvents;
// };



import axios from "axios";
import dotenv from "dotenv";
import Event from "../models/event.js"; // update path as needed

dotenv.config();

export const fetchEventsAndSave = async (retries = 3, delay = 3000) => {
  console.log("📡 Fetching all upcoming events from CoinMarketCal API...");

  let allEvents = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(
          "https://developers.coinmarketcal.com/v1/events",
          {
            headers: {
              "x-api-key": process.env.COINMARKETCAL_API_KEY,
              Accept: "application/json",
            },
            params: { limit: 20, page, lang: "en" },
            timeout: 30000,
          }
        );

        const events = response.data.body || response.data.events || [];
        console.log(`✅ Page ${page} API responded with ${events.length} events`);

        if (events.length === 0) {
          hasMore = false;
          break;
        }

        const mappedEvents = events.map((ev) => ({
          id: ev.id,
          title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
          description:
            typeof ev.description === "object"
              ? ev.description.en
              : ev.description || "No description available",
          date_event: ev.date_event,
          date_added: ev.date_added,
          proof: ev.proof || null,
          source: ev.source || null,
          original_source: ev.original_source || null,
          coins: ev.coins || [],
          categories: ev.categories || [],
          votes: ev.votes || 0,
          views: ev.views || 0,
          confidence: ev.confidence || 0,
          trending_indicator: ev.trending_indicator || false,
          trending_score: ev.trending_score || 0,
          popular_indicator: ev.popular_indicator || false,
          popular_score: ev.popular_score || 0,
          significant_indicator: ev.significant_indicator || false,
          significant_score: ev.significant_score || 0,
          catalyst_indicator: ev.catalyst_indicator || false,
          catalyst_score: ev.catalyst_score || 0,
          confirmed: ev.confirmed || false,
        }));

        for (const ev of mappedEvents) {
          try {
            await Event.upsert(ev);
          } catch (dbErr) {
            console.error(`❌ DB upsert failed for event ${ev.id}:`, dbErr.message);
          }
        }

        allEvents.push(...mappedEvents);
        page++; // next page
        break; // success, exit retry loop
      } catch (error) {
        console.error(
          `❌ Error fetching page ${page} (attempt ${i + 1}):`,
          error.response?.data || error.message
        );
        if (i === retries - 1) throw error;
        console.log(`🔄 Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  console.log(`💾 Total saved events: ${allEvents.length}`);
  return allEvents;
};
