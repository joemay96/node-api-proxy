const express =  require("express");
const morgan = require("morgan");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

//routes
const weather = require("./routes/weather");
const picture_of_the_day = require("./routes/picture");
//const rover = require("./routes/rover");
//const photoVideo = require("./routes/photoAndVideo");

const app = express();

app.set("trust proxy", 1);

app.use(express.static("public"));

//setting up the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.render("home",{
        message: "This Site has some information and uses the Nasa API to show some nice pictures from Space and has some interesting Info foor you to look at :)",
    })
})

app.use("/api/v1", api);

//using routes
app.use("/weather", weather);
app.use("/picture-of-the-day", picture_of_the_day);
//app.use("/rover", rover);
//app.use("/photos-videos", photoVideo);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;