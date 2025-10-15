import axios from "axios";
import dotenv from "dotenv";
import db from "../models/index.js"; // ESM import
const { Event } = db; // Destructure Event model
import { fetchEventsAndSave } from "../services/event.service.js";

dotenv.config();

export const fetchAndSaveEvents = async (req, res) => {
  try {
    const events = await fetchEventsAndSave();
    res.json({ events });
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ message: "Failed to fetch and save events" });
  }
};

// Optional: Get all events from DB
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["date_event", "DESC"]] });
    res.json({ events });
  } catch (err) {
    console.error("Error fetching events from DB:", err.message);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};
