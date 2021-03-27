/*
Things you can do to prevent Users from rate limiting your API-Key:
1. You can ratelimit User (IP adresses)
2. Increase the length of requests
3. You can create one of your own API Keys -> thats the core
*/
const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening: http://localhost:${PORT}`)
});