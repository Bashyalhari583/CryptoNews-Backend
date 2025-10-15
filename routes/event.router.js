// const express = require("express");
// const { fetchAndSaveEvents, getAllEvents } = require("../controllers/event.controller");

// const router = express.Router();

// // Fetch from API and Save to DB
// router.get("/events", fetchAndSaveEvents);

// // Get from DB
// // router.get("/", getAllEvents);

// module.exports = router;


import express from "express";
import { fetchAndSaveEvents, getAllEvents } from "../controllers/event.controller.js"; // ⬅️ add .js

const router = express.Router();

// Fetch from API and save to DB
router.get("/events", fetchAndSaveEvents);

// Get from DB
// router.get("/", getAllEvents);

export default router;
