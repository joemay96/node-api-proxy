const express = require("express");
const router = express.Router();

const mars_weather = require("./mars-weather"); 

router.get("/", (req,res) => {
    res.json({
        message: "API"
    })
});

router.use("/mars-weather", mars_weather);

module.exports = router;