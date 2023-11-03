const express = require("express");
const router = express.Router();

const Database = require("../../models/Database");
const db = new Database();
const db_instance = db.getConnection();

const Customer = require("../../models/class/Customers/Customers");
const customer_services = new Customer(db_instance);

const Items = require("../../models/class/Items/Items");
const items_services = new Items(db_instance);

const { KCDecrypt, KSEncrypt } = require("../../services/KTSec");

router.post("/setItem", (req, res) => {
	const { data } = req.body;

	const decrypt = JSON.parse(KCDecrypt(data));
	const token = decrypt.token;

	customer_services.decodeToken(token).then((data) => {
		if (data.type !== "admin") return null;
	});

	const { name, price, promotion, imgRef } = decrypt;

	items_services.setItem(name, price, promotion, imgRef).then((status) => {
		res.json(KSEncrypt(JSON.stringify(status)));
	});
});

router.post("/deleteItems", (req, res) => {
	const { data } = req.body
	
	const decrypt = JSON.parse(KCDecrypt(data));
	const token = decrypt.token;

	customer_services.decodeToken(token).then((data) => {
		if (data.type !== "admin") return null;
	});

	items_services.deleteItems(decrypt.data).then((status) => {
		res.json(KSEncrypt(JSON.stringify(status)))
	})
})

router.post("/getAllItems", (req, res) => {
	items_services.getAllItems().then((data) => {
		res.json(data);
	});
});

module.exports = router;
