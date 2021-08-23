const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const orderController = require('../controllers/orderController');
const { authorize } = require("../middleware/authorize");
const mongoUpload = require("../middleware/mongoUpload");

// router.post("/", jwtAuth, orderController.createOrder);

router.get("/allOrder", jwtAuth, orderController.allOrder);

module.exports = router;