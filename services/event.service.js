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


// const axios = require("axios");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
//   console.log("Fetching events from CoinMarketCal API...");

//   for (let i = 0; i < retries; i++) {
//     try {
//       // Fetch events from CoinMarketCal API
//       const response = await axios.get(
//         "https://developers.coinmarketcal.com/v1/events",
//         {
//           headers: {
//             "x-api-key": process.env.COINMARKETCAL_API_KEY,
//             Accept: "application/json",
//           },
//           params: {
//             limit: 16,
//             lang: "en",
//           },
//           timeout: 30000, // 30 seconds timeout
//         }
//       );

//       console.log("Full API Response:", response.data);

//       // fallback in case API returns different format
//       let events = response.data.body || response.data.events || [];

//       // Normalize and make sure description is not null
//       events = events.map((ev) => ({
//         id: ev.id,
//         title:
//           typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//         description:
//           (typeof ev.description === "object"
//             ? ev.description.en
//             : ev.description) || "No description available",
//         date_event: ev.date_event,
//         date_added: ev.date_added,
//         proof: ev.proof || null,
//         source: ev.source || null,
//         original_source: ev.original_source || null,
//         coins: ev.coins || [], // related coins
//         categories: ev.categories || [], // related categories
//         votes: ev.votes || 0,
//         views: ev.views || 0,
//         confidence: ev.confidence || 0,
//         trending_indicator: ev.trending_indicator || false,
//         trending_score: ev.trending_score || 0,
//         popular_indicator: ev.popular_indicator || false,
//         popular_score: ev.popular_score || 0,
//         significant_indicator: ev.significant_indicator || false,
//         significant_score: ev.significant_score || 0,
//         catalyst_indicator: ev.catalyst_indicator || false,
//         catalyst_score: ev.catalyst_score || 0,
//         confirmed: ev.confirmed || false,
//       }));

//       // Save in DB (upsert = insert or update)
//       for (const ev of events) {
//         await Event.upsert(ev);
//       }

//       console.log(`✅ Saved ${events.length} events into DB`);
//       return events;
//     } catch (error) {
//       console.error(`Error fetching events (attempt ${i + 1}):`, error.message);
//       if (i === retries - 1) throw error; // use correct variable
//       console.warn(`Retrying API... attempt ${i + 2}`);
//       await new Promise((res) => setTimeout(res, delay));
//     }
//   }
// };


// const axios = require("axios");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
//   console.log("📡 Fetching events from CoinMarketCal API...");

//   for (let i = 0; i < retries; i++) {
//     try {
//       // Step 1: Fetch main events
//       const response = await axios.get(
//         "https://developers.coinmarketcal.com/v1/events",
//         {
//           headers: {
//             "x-api-key": process.env.COINMARKETCAL_API_KEY,
//             Accept: "application/json",
//           },
//           params: { limit: 16, lang: "en" },
//           timeout: 30000,
//         }
//       );

//       let events = response.data.body || response.data.events || [];
//       console.log(`✅ Main API responded with ${events.length} events`);

//       // Step 2: Fetch detailed metrics per event
//       const detailedEvents = [];
//       for (const ev of events) {
//         try {
//           const detailRes = await axios.get(
//             `https://developers.coinmarketcal.com/v1/events/${ev.id}`,
//             {
//               headers: {
//                 "x-api-key": process.env.COINMARKETCAL_API_KEY,
//                 Accept: "application/json",
//               },
//               timeout: 30000,
//             }
//           );

//           const detail = detailRes.data.body || detailRes.data.event || {};

//           detailedEvents.push({
//             id: ev.id,
//             title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//             description:
//               typeof ev.description === "object"
//                 ? ev.description.en
//                 : ev.description || "No description available",
//             date_event: ev.date_event,
//             date_added: ev.date_added,
//             proof: ev.proof || null,
//             source: ev.source || null,
//             original_source: ev.original_source || null,
//             coins: ev.coins || [],
//             categories: ev.categories || [],
//             votes: detail.votes || 0,
//             views: detail.views || 0,
//             confidence: detail.confidence || 0,
//             trending_indicator: detail.trending_indicator || false,
//             trending_score: detail.trending_score || 0,
//             popular_indicator: detail.popular_indicator || false,
//             popular_score: detail.popular_score || 0,
//             significant_indicator: detail.significant_indicator || false,
//             significant_score: detail.significant_score || 0,
//             catalyst_indicator: detail.catalyst_indicator || false,
//             catalyst_score: detail.catalyst_score || 0,
//             confirmed: detail.confirmed || false,
//           });
//         } catch (detailError) {
//           console.error(`⚠️ Could not fetch metrics for event ${ev.id}: ${detailError.message}`);
//           // fallback to basic info only
//           detailedEvents.push({
//             id: ev.id,
//             title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//             description:
//               typeof ev.description === "object"
//                 ? ev.description.en
//                 : ev.description || "No description available",
//             date_event: ev.date_event,
//             date_added: ev.date_added,
//             proof: ev.proof || null,
//             source: ev.source || null,
//             original_source: ev.original_source || null,
//             coins: ev.coins || [],
//             categories: ev.categories || [],
//             votes: 0,
//             views: 0,
//             confidence: 0,
//             trending_indicator: false,
//             trending_score: 0,
//             popular_indicator: false,
//             popular_score: 0,
//             significant_indicator: false,
//             significant_score: 0,
//             catalyst_indicator: false,
//             catalyst_score: 0,
//             confirmed: false,
//           });
//         }
//       }

//       // Step 3: Save all events in DB
//       for (const ev of detailedEvents) {
//         await Event.upsert(ev);
//       }

//       console.log(`💾 Saved ${detailedEvents.length} events into DB`);
//       return detailedEvents;

//     } catch (error) {
//       console.error(`❌ Error fetching events (attempt ${i + 1}): ${error.message}`);
//       if (i === retries - 1) throw error;
//       console.log(`🔄 Retrying in ${delay / 1000}s...`);
//       await new Promise((res) => setTimeout(res, delay));
//     }
//   }
// };





// const axios = require("axios");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
//   console.log("📡 Fetching events from CoinMarketCal API...");

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await axios.get(
//         "https://developers.coinmarketcal.com/v1/events",
//         {
//           headers: {
//             "x-api-key": process.env.COINMARKETCAL_API_KEY,
//             Accept: "application/json",
//           },
//           params: { limit: 16, lang: "en" },
//           timeout: 30000,
//         }
//       );

//       // Print only summary, not full response
//       console.log(
//         `✅ API responded with ${
//           response.data.body?.length || response.data.events?.length || 0
//         } events`
//       );

//       let events = response.data.body || response.data.events || [];

//       events = events.map((ev) => ({
//         id: ev.id,
//         title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//         description:
//           (typeof ev.description === "object"
//             ? ev.description.en
//             : ev.description) || "No description available",
//         date_event: ev.date_event,
//         date_added: ev.date_added,
//         proof: ev.proof || null,
//         source: ev.source || null,
//         original_source: ev.original_source || null,
//         coins: ev.coins || [],
//         categories: ev.categories || [],
//         votes: ev.votes || 0,
//         views: ev.views || 0,
//         confidence: ev.confidence || 0,
//         trending_indicator: ev.trending_indicator || false,
//         trending_score: ev.trending_score || 0,
//         popular_indicator: ev.popular_indicator || false,
//         popular_score: ev.popular_score || 0,
//         significant_indicator: ev.significant_indicator || false,
//         significant_score: ev.significant_score || 0,
//         catalyst_indicator: ev.catalyst_indicator || false,
//         catalyst_score: ev.catalyst_score || 0,
//         confirmed: ev.confirmed || false,
//       }));

//       for (const ev of events) {
//         await Event.upsert(ev);
//       }

//       console.log(`💾 Saved ${events.length} events into DB`);
//       return events;
//     } catch (error) {
//       console.error(`❌ Error fetching events (attempt ${i + 1}): ${error.message}`);
//       if (i === retries - 1) throw error;
//       console.log(`🔄 Retrying in ${delay / 1000}s...`);
//       await new Promise((res) => setTimeout(res, delay));
//     }
//   }
// };


// const axios = require("axios");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
//   console.log("📡 Fetching events from CoinMarketCal API...");

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await axios.get(
//         "https://developers.coinmarketcal.com/v1/events",
//         {
//           headers: {
//             "x-api-key": process.env.COINMARKETCAL_API_KEY,
//             Accept: "application/json",
//           },
//           params: { limit: 18, lang: "en" },
//           timeout: 30000,
//         }
//       );

//       let events = response.data.body || response.data.events || [];

//       events = events.map((ev) => {
//         const descriptionText =
//           (typeof ev.description === "object" ? ev.description.en : ev.description) || "No description available";

//         return {
//           id: ev.id,
//           title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//           description: descriptionText,
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
//         };
//       });

//       await Event.bulkCreate(events, { updateOnDuplicate: Object.keys(Event.rawAttributes) });
//       console.log(`💾 Saved ${events.length} events into DB`);
//       return events;
//     } catch (error) {
//       console.error(`❌ Error fetching events (attempt ${i + 1}): ${error.message}`);
//       if (i === retries - 1) throw error;
//       console.log(`🔄 Retrying in ${delay / 1000}s...`);
//       await new Promise((res) => setTimeout(res, delay));
//     }
//   }
// };


const axios = require("axios");
const { Event } = require("../models");
require("dotenv").config();

exports.fetchEventsAndSave = async (retries = 3, delay = 3000) => {
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
        page++; // go to next page
        break; // exit retry loop on success

      } catch (error) {
        console.error(`❌ Error fetching page ${page} (attempt ${i + 1}):`, error.response?.data || error.message);
        if (i === retries - 1) throw error;
        console.log(`🔄 Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  console.log(`💾 Total saved events: ${allEvents.length}`);
  return allEvents;
};
