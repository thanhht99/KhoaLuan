const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const productController = require('../controllers/productController');
const { authorize } = require("../middleware/authorize");
const mongoUpload = require("../middleware/mongoUpload");

router.post("/create",
    jwtAuth,
    mongoUpload.single("image"),
    authorize("Admin"),
    productController.createNewProduct
);

router.get("/all", jwtAuth, authorize("Admin"), productController.getAllProducts);

router.get("/:sku", jwtAuth, productController.getProductBySku);

router.get("/image/:sku", jwtAuth, productController.getImageProductBySku);

module.exports = router;