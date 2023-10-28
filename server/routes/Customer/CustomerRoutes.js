const express = require("express");
const router = express.Router();

const Database = require("../../models/Database");
const db = new Database();
const db_instance = db.getConnection();

const Customers = require("../../models/class/Customers/Customers");
const customers_services = new Customers(db_instance);

const { KCDecrypt, KSEncrypt } = require("../../services/KTSec");

const express_rateL = require("express-rate-limit");

const limiter_4register = express_rateL({
    windowMs: 30 * 60 * 1000,
    max: 1,
    message: "Too many request wait 30 minutes.",
});

const limiter_4login = express_rateL({
    windowMs: 30 * 60 * 1000,
    max: 30,
    message: "Too many request wait 30 minutes.",
});

/**
 * Registration
 * @param {{firstname: string, lastname: string, email: string, password: string}} req.body
 */
router.use("/register", limiter_4register);
router.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    customers_services
        .register(firstname, lastname, email, password)
        .then((result) => {
            res.json(result);
        });
});

/**
 * Login
 * @param {{email: string, password: string}}
 */
router.use("/login", limiter_4login);
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    customers_services.login(email, password).then((token) => {
        res.json(token ? token : null);
    });
});

/**
 * Get user data
 * @param {{token: string}}
 */
router.post("/getInfo", (req, res) => {
    const { data } = req.body;

    const decrypt = KCDecrypt(data);

    customers_services.getInfo(decrypt).then((data) => {
        res.json(data ? KSEncrypt(JSON.stringify(data)) : null);
    });
});

/**
 * Check is takin is valid
 * @param {{token: string}}
 */
router.post("/verifyTokenValidity", (req, res) => {
    const { token } = req.body;

    customers_services.verifyTokenValidity(token).then((data) => {
        res.json(data);
    });
});

module.exports = router;
