require("dotenv").config();
const logColor = "\x1b[42m\x1b[30m";

/**
 * Express
 * */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

/**
 * Database
 * */
const Database = require("../models/Database");
const db_instance = new Database();
db_instance.test();

/**
 * Routes
 */
const item = require("../routes/Item/ItemRoutes");
const customers = require("../routes/Customer/CustomerRoutes");
app.use("/customer", customers);
app.use("/item", item);

app.listen(process.env.PORT, () => {
    console.log(`${logColor}?Server:: on ${process.env.PORT}`, "[OK]\x1b[0m");
});
