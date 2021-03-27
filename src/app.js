const express =  require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();
//If youre app is behind a proxy the proxy will typically set the header x-forwareded-for. This is actually the IP Adress of the requesting client
//This says that we should trust this header because our code is behind such a proxy
//And it makes sure that we ratelimit the right IP Adresses --> ratelimiting localhost is not what we want
app.set("trust proxy", 1);


app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json({
        message: "Some Emojis! :) "
    })
})

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;