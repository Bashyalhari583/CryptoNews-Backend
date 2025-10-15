// import axios from "axios";
// import db from "../config/db.js";
// import dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Crypto APIs list
// const apis = [
//   "https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
//   "https://newsdata.io/api/1/news?apikey=" + process.env.NEWSDATA_API_KEY,
//   `https://api.coinstats.app/public/v3/news?skip=0&limit=20&apiKey=${process.env.COINSTATS_API_KEY}`,
// ];

// // Limit concurrency to prevent rate limits
// const CONCURRENT_LIMIT = 5;

// /**
//  * Fetch news from all APIs
//  */
// const fetchNewsFromAPI = async (url, retries = 3, delay = 3000) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await axios.get(url);
//       const data = response.data;

//       // Normalize news format
//       let normalized = [];

//       if (data?.Data) {
//         // CryptoCompare
//         normalized = data.Data.map((n) => ({
//           title: n.title || "Untitled",
//           description: n.body || "No description",
//           image: n.imageurl || null,
//           url: n.url || null,
//         }));
//       } else if (data?.results) {
//         // NewsData.io
//         normalized = data.results.map((n) => ({
//           title: n.title || "Untitled",
//           description: n.description || "No description",
//           image: n.image_url || null,
//           url: n.link || null,
//         }));
//       } else if (data?.news) {
//         // CoinStats
//         normalized = data.news.map((n) => ({
//           title: n.title || "Untitled",
//           description: n.description || "No description",
//           image: n.imageUrl || null,
//           url: n.link || null,
//         }));
//       }

//       console.log(`✅ API responded successfully: ${url}`);
//       return normalized;
//     } catch (err) {
//       console.error(
//         `❌ Error fetching ${url} (attempt ${i + 1}):`,
//         err.response?.status || err.message
//       );
//       if (i !== retries - 1) await new Promise((res) => setTimeout(res, delay));
//     }
//   }
//   return [];
// };

// /**
//  * Rewrite news using OpenAI, fallback Hugging Face
//  */
// const rewriteNews = async (title, description) => {
//   const MAX_DESC_LENGTH = 1000;
//   const shortDesc =
//     description.length > MAX_DESC_LENGTH
//       ? description.slice(0, MAX_DESC_LENGTH) + "..."
//       : description;

//   const prompt = `
// Rewrite this crypto news to be short, clear, and professional.
// Avoid jargon and make it easy to understand.

// Title: ${title}
// Description: ${shortDesc}
// `;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4.1",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });
//     console.log(completion.choices[0]);
//     return completion.choices[0].message.content.trim() || shortDesc;
//   } catch (err) {
//     if (err.response?.status === 429 || err.response?.status === 401) {
//       console.warn(
//         `⚠️ OpenAI quota/auth error detected (${err.response?.status}). Using Hugging Face fallback...`
//       );

//       const response = await axios.post(
//         "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
//         { inputs: shortDesc },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           },
//         }
//       );

//       return response.data?.[0]?.summary_text || shortDesc;
//     }
//     return shortDesc;
//   }
// };

// /**
//  * Save news to MySQL
//  */
// const saveNewsToDB = async (news) => {
//   const sql = `
//     INSERT INTO news (title, description, image, url)
//     VALUES (?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE description = VALUES(description)
//   `;
//   await db.query(sql, [news.title, news.description, news.image, news.url]);
// };

// /**
//  * Main function
//  */
// export const fetchAndStoreNews = async () => {
//   console.log("📡 Fetching crypto news from multiple APIs...");

//   // Fetch news from all APIs
//   const allFetchedNewsResults = await Promise.allSettled(
//     apis.map((api) => fetchNewsFromAPI(api))
//   );
//   const allFetchedNews = allFetchedNewsResults
//     .filter((r) => r.status === "fulfilled")
//     .map((r) => r.value);

//   // Flatten and remove duplicates
//   const allNews = Array.from(
//     new Map(allFetchedNews.flat().map((item) => [item.url, item])).values()
//   ).slice(0, 40);

//   console.log(`📰 Total ${allNews.length} unique news fetched.`);

//   // Rewrite and save news with limited concurrency
//   const queue = [...allNews];

//   const workers = Array.from({ length: CONCURRENT_LIMIT }, async () => {
//     while (queue.length > 0) {
//       const news = queue.shift();
//       try {
//         news.description = await rewriteNews(news.title, news.description);
//         await saveNewsToDB(news);
//         console.log(`✅ Saved: ${news.title}`);
//       } catch (err) {
//         console.error(`❌ Failed: ${news.title}`, err.message);
//       }
//     }
//   });

//   await Promise.all(workers);
//   console.log("🎉 All news fetched, rewritten, and saved successfully.");
// };

import axios from "axios";
import db from "../config/db.js";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Crypto APIs list
const apis = [
  "https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
  `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}`,
  `https://api.coinstats.app/public/v3/news?skip=0&limit=20&apiKey=${process.env.COINSTATS_API_KEY}`,
];

// Limit concurrency to prevent rate limits
const CONCURRENT_LIMIT = 5;

/**
 * Fetch news from a single API with retries
 */
const fetchNewsFromAPI = async (url, retries = 3, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      const data = response.data;

      let normalized = [];

      if (data?.Data) {
        // CryptoCompare
        normalized = data.Data.map((n) => ({
          title: n.title || "Untitled",
          description: n.body || "No description",
          image: n.imageurl || null,
          url: n.url || null,
        }));
      } else if (data?.results) {
        // NewsData.io
        normalized = data.results.map((n) => ({
          title: n.title || "Untitled",
          description: n.description || "No description",
          image: n.image_url || null,
          url: n.link || null,
        }));
      } else if (data?.news) {
        // CoinStats
        normalized = data.news.map((n) => ({
          title: n.title || "Untitled",
          description: n.description || "No description",
          image: n.imageUrl || null,
          url: n.link || null,
        }));
      }

      console.log(`✅ API responded successfully: ${url}`);
      return normalized;
    } catch (err) {
      console.error(
        `❌ Error fetching ${url} (attempt ${i + 1}):`,
        err.response?.status || err.message
      );
      if (i !== retries - 1) await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.warn(`⚠️ Failed to fetch from API after ${retries} attempts: ${url}`);
  return [];
};

/**
 * Rewrite news using OpenAI with Hugging Face fallback
 */
const rewriteNews = async (title, description) => {
  const MAX_DESC_LENGTH = 1000;
  const shortDesc =
    description.length > MAX_DESC_LENGTH
      ? description.slice(0, MAX_DESC_LENGTH) + "..."
      : description;

  const prompt = `
Rewrite this crypto news to be short, clear, and professional.
Avoid jargon and make it easy to understand.

Title: ${title}
Description: ${shortDesc}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    return completion.choices[0].message.content.trim() || shortDesc;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    if (err.response?.status === 429 || err.response?.status === 401) {
      console.warn(
        `⚠️ OpenAI quota/auth error detected (${err.response?.status}). Using Hugging Face fallback...`
      );

      try {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
          { inputs: shortDesc },
          {
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
          }
        );
        return (
          response.data?.[0]?.summary_text ||
          response.data?.summary_text ||
          shortDesc
        );
      } catch (hfErr) {
        console.error("Hugging Face error:", hfErr.message);
        return shortDesc;
      }
    }
    return shortDesc;
  }
};

/**
 * Save news to MySQL
 */
const saveNewsToDB = async (news) => {
  const sql = `
    INSERT INTO news (title, description, image, url)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE description = VALUES(description)
  `;
  await db.query(sql, [news.title, news.description, news.image, news.url]);
};

/**
 * Main function to fetch, rewrite, and save news
 */
export const fetchAndStoreNews = async () => {
  console.log("📡 Fetching crypto news from multiple APIs...");

  const allFetchedNewsResults = await Promise.allSettled(
    apis.map((api) => fetchNewsFromAPI(api))
  );
  const allFetchedNews = allFetchedNewsResults
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  // Flatten and remove duplicates
  const allNews = Array.from(
    new Map(allFetchedNews.flat().map((item) => [item.url, item])).values()
  ).slice(0, 40);

  console.log(`📰 Total ${allNews.length} unique news fetched.`);

  // Rewrite and save news with concurrency
  const queue = [...allNews];

  const worker = async () => {
    while (queue.length > 0) {
      const news = queue.shift();
      if (!news) break;
      try {
        news.description = await rewriteNews(news.title, news.description);
        await saveNewsToDB(news);
        console.log(`✅ Saved: ${news.title}`);
      } catch (err) {
        console.error(`❌ Failed: ${news.title}`, err.message);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENT_LIMIT }, worker));
  console.log("🎉 All news fetched, rewritten, and saved successfully.");
};
