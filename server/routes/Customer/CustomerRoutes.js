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

const limiter_4modifying = express_rateL({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many request wait 1 hour.",
})

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
    const { 
        data
    } = req.body;

    const decrypt = JSON.parse(KCDecrypt(data))
    const decryptEmail = decrypt.email
    const decryptPassword = decrypt.password

    customers_services.login(decryptEmail, decryptPassword).then((token) => {
        res.json(token ? KSEncrypt(JSON.stringify(token)) : null);
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
 * Modify Firstname
 * @param {"{data: string, token: string}"} data new Firstname
 * @return {boolean}
 */
router.use("/changeFirstname", limiter_4modifying)
router.post("/changeFirstname", (req, res) => {
    const {
        data
    } = req.body

    const decrypt = JSON.parse(KCDecrypt(data))
    const decryptData = decrypt.firstname
    const decryptToken = decrypt.token

    customers_services.changeFirstname(decryptData, decryptToken).then((result) => {
        const sCrypt = KSEncrypt(JSON.stringify({data: result}))
        res.json(sCrypt)
    })
})

router.use("/changeLastname", limiter_4modifying)
router.post("/changeLastname", (req, res) => {
    const {
        data
    } = req.body

    const decrypt = JSON.parse(KCDecrypt(data))
    const decryptData = decrypt.lastname
    const decryptToken = decrypt.token

    customers_services.changeLastname(decryptData, decryptToken).then((result) => {
        const sCrypt = KSEncrypt(JSON.stringify({data: result}))
        res.json(sCrypt)
    })
})

router.use("/changeEmail", limiter_4modifying)
router.use("/changeEmail", (req, res) => {
    const {
        data
    } = req.body

    const decrypt = JSON.parse(KCDecrypt(data))
    const decryptData = decrypt.email
    const decryptToken = decrypt.token

    customers_services.changeEmail(decryptData, decryptToken).then((result) => {
        const sCrypt = KSEncrypt(JSON.stringify({data: result}))
        res.json(sCrypt)
    })
})

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
