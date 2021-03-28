const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100, 
})

const speedLimiter = slowDown({
    windowMs: 60 * 1000,
    delayAfter: 20,
    delayMs: 200,
})


const router = express.Router();

const BASE_URL = "https://api.nasa.gov/insight_weather/?";

let cachedData;
let cachedTime;

router.get("/", limiter, speedLimiter, async (req, res, next) => {
    if(cachedTime && cachedTime > Date.now() - 10*60*1000) {
        return res.render("weather", { data: cachedData });
    }
    try {
        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY,
            feedtype: "json",
            ver: "1.0",
        });
    
        const { data } = await axios.get(`${BASE_URL}${params}`);
        cachedData = data;
        cachedTime = Date.now();
        return res.render("weather", {data})
    } catch(err1) {
        return next(err);
    }
    
})

module.exports = router;