const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const billController = require('../controllers/billController');
const { authorize } = require("../middleware/authorize");

router.post("/export/:id", jwtAuth, authorize("Admin", "Saler"), billController.exportBill);

module.exports = router;