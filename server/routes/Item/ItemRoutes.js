const express = require("express");
const router = express.Router();

const Database = require("../../models/Database");
const db = new Database();
const db_instance = db.getConnection();

const Items = require("../../models/class/Items/Items");
const items_services = new Items(db_instance);

router.post("/setItem", (req, res) => {
    const { name, price, promotion } = req.query;

    items_services.setItem(name, price, promotion).then((status) => {
        res.json(status ? status : null);
    });
});

module.exports = router;
