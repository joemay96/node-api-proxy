const express = require("express");
const axios = require("axios");

const router = express.Router();

const BASE_URL = "https://api.nasa.gov/planetary/apod/?";

let cachedData;
let cachedTime;

router.get("/", async (req, res, next) => {
    if(cachedTime && cachedTime > Date.now() - 8*60*60*1000) {
        return res.render("picture", {data: cachedData});
    }
    try {
        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY
        });
    
        const { data } = await axios.get(`${BASE_URL}${params}`);

        cachedData = data;
        cachedTime = Date.now()

        return res.render("picture", {data});
    } catch(err) {
        return next(err);
    }
    
})

module.exports = router;