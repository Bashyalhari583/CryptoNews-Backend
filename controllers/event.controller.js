// const axios = require("axios");
// const { Event } = require("../models");
// const {Sequelize , Op} = require("sequelize");

// exports.fetchAndSaveEvents = async (req, res) => {
  

//   try {
//     // Fetch events from CoinMarketCal API
//     const response = await axios.get("https://developers.coinmarketcal.com/v1/events", {
//       headers: {
//         "x-api-key": process.env.COINMARKETCAL_API_KEY,
//         "Accept": "application/json"
//       },
//     });
// console.log("API KEY:", process.env.COINMARKETCAL_API_KEY);
//     const apiEvents = response.data.body;
//     console.log(response.data);

//     // Save events into DB
//     const savedEvents = [];
//     for (const e of apiEvents) {
//       const event = await Event.create({
//         title: e.title,
//         description: e.description,
//         date_event: e.date_event,
//         url: e.proof,
//       });
//       savedEvents.push(event);
//     }

//     res.status(201).json(savedEvents);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch and save events" });
//   }
// };

// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.findAll();
//     res.json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to retrieve events" });
//   }
// };



// const axios = require("axios");
// const { Event } = require("../models");
// const { Sequelize, Op } = require("sequelize");
// require('dotenv').config();

// exports.fetchAndSaveEvents = async (req, res) => {
//   console.log("Full API Response:", res.data);
//   console.log("Fetching events from CoinMarketCal API...");

//   try {
//     const response = await axios.get("https://developers.coinmarketcal.com/v1/events", {
//       headers: {
//         "x-api-key": process.env.COINMARKETCAL_API_KEY,
//         "Accept": "application/json"
//       },
//       params: {
//         // lang: 'en', // Fetch events in English
       
//         limit: 20   // Example: limit to 20 events
//       }
//     });

//     // const apiEvents = response.data.body;
//     // console.log("API Events fetched:", apiEvents.length);

//     // const savedEvents = [];
//     // for (const e of apiEvents) {
//     //   const [event] = await Event.findOrCreate({
//     //     where: { title: e.title.en },
//     //     defaults: {
//     //       title: e.title.en,
//     //       description: e.description?.en || "No description available",
//     //       date_event: e.date_event, // or new Date(e.date_event)
//     //       url: e.proof,
//     //     }
//     //   });
//     //   savedEvents.push(event);
//     // }

//     // res.status(201).json(savedEvents);

//     let events = response.data.body;

//     // Normalize data (avoid { en: "..." } format)
//     events = events.map((ev) => ({
//       id: ev.id,
//       title: typeof ev.title === "object" ? ev.title.en : ev.title,
//       description: typeof ev.description === "object" ? ev.description.en : ev.description,
//       date_event: ev.date_event,
//       source: ev.source,
//     }));

//     // Save in DB (optional, here just upsert)
//     for (const ev of events) {
//       await Event.upsert(ev);
//     }

//     console.log(`API Events fetched: ${events.length}`);

//     res.json({ events }); // frontend expects { events: [...] }
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     res.status(500).json({ message: "Failed to fetch and save events" });
//   }
// };

// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.findAll();
//     res.json(events);
//   } catch (error) {
//     console.error("Error retrieving events:", error.message);
//     res.status(500).json({ message: "Failed to retrieve events" });
//   }
// };



// const axios = require("axios");
// const { Event } = require("../models");
// require("dotenv").config();

// exports.fetchAndSaveEvents = async (req, res) => {
//   console.log("Fetching events from CoinMarketCal API...");

//   try {
//     const response = await axios.get("https://developers.coinmarketcal.com/v1/events", {
//       headers: {
//         "x-api-key": process.env.COINMARKETCAL_API_KEY,
//         "Accept": "application/json"
//       },
//       params: {
//         limit: 20,   // limit to 20 events (adjust as needed)
//         lang: "en"   // fetch in English
//       }
//     });

//     let events = response.data.body;

//     // Normalize and make sure description is not null
//     events = events.map((ev) => ({
//       id: ev.id,
//       title: typeof ev.title === "object" ? ev.title.en : ev.title || "No Title",
//       description:
//         (typeof ev.description === "object" ? ev.description.en : ev.description) ||
//         "No description available",
//       date_event: ev.date_event,
//       date_added: ev.date_added,
//       proof: ev.proof || null,
//       source: ev.source || null,
//       original_source: ev.original_source || null,
//       coins: ev.coins || [],           // related coins
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
//       confirmed: ev.confirmed || false
//     }));

//     // Save in DB (upsert = insert or update)
//     for (const ev of events) {
//       await Event.upsert(ev);
//     }

//     console.log(`API Events fetched: ${events.length}`);
//     res.json({ events });
//   } catch (error) {
//     console.error("Error fetching events:", error.message);
//     res.status(500).json({ message: "Failed to fetch and save events" });
//   }
// };


const axios = require("axios");
const { Event } = require("../models");
const { fetchEventsAndSave } = require("../services/event.service");
require("dotenv").config();

exports.fetchAndSaveEvents = async (req, res) => {
  try {
    const events = await fetchEventsAndSave();
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch and save events" });
  }
};
