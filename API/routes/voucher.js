const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const voucherController = require('../controllers/voucherController');
const { authorize } = require("../middleware/authorize");

router.get("/all", jwtAuth, authorize("Admin"), voucherController.getAllVouchers);

router.post("/create", jwtAuth, authorize("Admin"), voucherController.createNewVoucher);

router.patch("/update/:id", jwtAuth, authorize("Admin"), voucherController.updateVoucher);

router.patch("/updateActive/:id", jwtAuth, authorize("Admin"), voucherController.updateActiveVoucher);

router.delete("/delete/:id", jwtAuth, authorize("Admin"), voucherController.deleteVoucher);

module.exports = router;