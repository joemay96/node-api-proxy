const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");//Prevents people from spaming your API 
const slowDown = require("express-slow-down");//Prevents people from spaming your API 


//Enable if you're behind a reverse proxy (Heroku, AWS ELB, Ngnix)
//see https://expressjs.com/en/guide/behind-proxies.html
//app.set("trust proxy", 1);

//If you overcome the rate limit you get a 429 which is to many requests
const limiter = rateLimit({
    windowMs: 30 * 1000, //30 seconds
    max: 10, // limit each IP to 10 requests per windowMs -> max 10 Requests every 30 seconds
})

const speedLimiter = slowDown({
    windowMs: 30 * 1000,
    delayAfter: 1, // after the first request we will 
    delayMs: 500, //delay every request by 500ms
})


const router = express.Router();

//https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0
const BASE_URL = "https://api.nasa.gov/insight_weather/?";

//Caching is probably the best thing to reduce the load of an api endpoint
let cachedData;
let cachedTime;

//Probably the last step is to provide own API-Keys
const apiKeys = new Map();
//creating own apiKey -> could and should be probably stored in memory
apiKeys.set("12345", true);

//using the limiter -> first the limiter and than the speedLimiter 
router.get("/", limiter, speedLimiter, (req, res, next) => {
        //own middleware for own API Key
        //Users that call my API are required to specify a X-API-KEY
        const apiKey = req.get("X-API-KEY");
        if(apiKeys.has(apiKey)){
            next();
        } else {
            const error = new Error("Invalid API KEY");
            next(error);
        }
    }, 
    //Putting the API-KEY middleware behind speed- and rate-limiter so that if someone bruteforcses api-keys it takes ages
    async (req, res, next) => {
    //In Memory Cache -> okay if simple but 
    //You could also do this with a Database in the Background (redis or mongoDB)
                                //current time - 30 seconds => hole alle 30 Sekunden neue Daten
    //If we have cached Data and it is not older than 30 seconds we give back the cached Data
    if(cachedTime && cachedTime > Date.now() - 30*1000) {
        return res.json(cachedData);
    }

    try {
        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY,
            feedtype: "json",
            ver: "1.0",
        });
    
        //1. make a request to nasa api
        // $params in `` backticks will do the trick
        const { data } = await axios.get(`${BASE_URL}${params}`);
        //2. respond to this request with data from nasa api
        cachedData = data;
        cachedTime = Date.now();
        //data.cachedTime = cachedTime;
        return res.json(data);
    } catch(err1) {
        return next(err);
    }
    
})

module.exports = router;