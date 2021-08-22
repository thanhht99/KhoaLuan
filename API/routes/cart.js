const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const cartController = require('../controllers/cartController');
const { authorize } = require("../middleware/authorize");

router.get("/", jwtAuth, cartController.getCart);

router.post("/addItem", jwtAuth, cartController.addItemToCart);

router.post("/subItem", jwtAuth, cartController.subItemFromCart);

router.delete("/emptyCart", jwtAuth, cartController.emptyCart);

router.post("/removeProduct", jwtAuth, cartController.removeProductFromCart);

module.exports = router;