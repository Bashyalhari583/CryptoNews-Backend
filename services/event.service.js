// const axios = require("axios");
// const { Op } = require("sequelize");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
  
//   console.log("Fetching events from CoinMarketCal API...");
//    for (let i = 0; i < retries; i++) {
//   try {
//     // Fetch events from CoinMarketCal API
//     const response = await axios.get(
//       "https://developers.coinmarketcal.com/v1/events",
//       {
//         headers: {
//           "x-api-key": process.env.COINMARKETCAL_API_KEY,
//           Accept: "application/json",
//         },
//         params: {
//           limit: 20,
//           lang: "en",
//         },
//         timeout: 10000, // 10 seconds timeout
//       }
//     );
//     console.log("Full API Response:", response.data);
//     let events = response.data.body || [];

//     // Normalize and make sure description is not null
//     events = events.map((ev) => ({
//       id: ev.id,
//       title:
//         typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//       description:
//         (typeof ev.description === "object"
//           ? ev.description.en
//           : ev.description) || "No description available",
//       date_event: ev.date_event,
//       date_added: ev.date_added,
//       proof: ev.proof || null,
//       source: ev.source || null,
//       original_source: ev.original_source || null,
//       coins: ev.coins || [], // related coins
//       categories: ev.categories || [], // related categories
//       votes: ev.votes || 0,
//       views: ev.views || 0,
//       confidence: ev.confidence || 0,
//       trending_indicator: ev.trending_indicator || false,
//       trending_score: ev.trending_score || 0,
//       popular_indicator: ev.popular_indicator || false,
//       popular_score: ev.popular_score || 0,
//       significant_indicator: ev.significant_indicator || false,
//       significant_score: ev.significant_score || 0,
//       catalyst_indicator: ev.catalyst_indicator || false,
//       catalyst_score: ev.catalyst_score || 0,
//       confirmed: ev.confirmed || false,
//     }));

//     // Save in DB (upsert = insert or update)
//     for (const ev of events) {
//       await Event.upsert(ev);
//     }

//     return events;
//   } catch (error) {
//      if (i === retries - 1) throw err;
//       console.warn(`Retrying API... attempt ${i + 1}`);
//       await new Promise((res) => setTimeout(res, delay));
//   }
// }
// }


const axios = require("axios");
const { Event } = require("../models");
require("dotenv").config();

exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
  console.log("Fetching events from CoinMarketCal API...");

  for (let i = 0; i < retries; i++) {
    try {
      // Fetch events from CoinMarketCal API
      const response = await axios.get(
        "https://developers.coinmarketcal.com/v1/events",
        {
          headers: {
            "x-api-key": process.env.COINMARKETCAL_API_KEY,
            Accept: "application/json",
          },
          params: {
            limit: 20,
            lang: "en",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      console.log("Full API Response:", response.data);

      // fallback in case API returns different format
      let events = response.data.body || response.data.events || [];

      // Normalize and make sure description is not null
      events = events.map((ev) => ({
        id: ev.id,
        title:
          typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
        description:
          (typeof ev.description === "object"
            ? ev.description.en
            : ev.description) || "No description available",
        date_event: ev.date_event,
        date_added: ev.date_added,
        proof: ev.proof || null,
        source: ev.source || null,
        original_source: ev.original_source || null,
        coins: ev.coins || [], // related coins
        categories: ev.categories || [], // related categories
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

      // Save in DB (upsert = insert or update)
      for (const ev of events) {
        await Event.upsert(ev);
      }

      console.log(`✅ Saved ${events.length} events into DB`);
      return events;
    } catch (error) {
      console.error(`Error fetching events (attempt ${i + 1}):`, error.message);
      if (i === retries - 1) throw error; // use correct variable
      console.warn(`Retrying API... attempt ${i + 2}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};
