const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const promotionController = require('../controllers/promotionController');
const { authorize } = require("../middleware/authorize");

router.get("/all", jwtAuth, authorize("Admin"), promotionController.getAllPromotions);

router.post("/create", jwtAuth, authorize("Admin"), promotionController.createNewPromotion);

router.patch("/update/:id", jwtAuth, authorize("Admin"), promotionController.updatePromotion);

router.patch("/updateActive/:id", jwtAuth, authorize("Admin"), promotionController.updateActivePromotion);

router.delete("/delete/:id", jwtAuth, authorize("Admin"), promotionController.deletePromotion);

module.exports = router;