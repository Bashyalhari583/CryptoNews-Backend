const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const { fetchAndSaveEvents } = require("./controllers/event.controller");
const { fetchEventsAndSave } = require("./services/event.service")
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const eventRoutes = require ("./routes/event.router")


//routes
app.use("/api",eventRoutes);

// Real-time update: fetch every 5 minutes
setInterval(async () => {
  console.log("Fetching events from CoinMarketCal (auto update)...");
  try {
    await fetchEventsAndSave(); // dummy req/res
    console.log("Events auto-updated successfully");
  } catch (err) {
    console.error("Error auto fetching events:", err.message);
  }
}, 5 * 60 * 1000); // 5 minutes

const PORT = process.env.PORT || 5000;

app.use("/", (req, res, next) => {
  res.send(`<div 
        style="display:flex; 
               align-items:center; 
               justify-content:center; 
               height:98vh; 
               background-color: #0D1B2A; 
                color: #E0E1DD;
               font-size:32px;">
            <h1> Wellcome to CryptoNews Backend </h1>
        </div>
        `);
});



app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
