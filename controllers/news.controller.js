import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export const getNews = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM News ORDER BY createdAt DESC LIMIT 30"
    );

    res.json({ news: results });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ message: err });
  }
};
