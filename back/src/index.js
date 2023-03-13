const express = require("express");
const cors = require("cors");

const app = express();
const routes = require("./routes");
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(routes);
app.set("PORT", PORT);

module.exports = app;
