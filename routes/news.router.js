// import express from "express";
// import { getNews } from "../controllers/news.controller";

// const router = express.Router();

// router.get("/news", getNews);

// export default router;

import express from "express";
import { getNews } from "../controllers/news.controller.js";

const router = express.Router();

// GET /api/news
router.get("/", getNews);

export default router;
