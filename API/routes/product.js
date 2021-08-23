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

router.get("/all", jwtAuth, productController.getAllProducts);

router.get("/allByActive", jwtAuth, productController.getAllProductsSortByIsActive);

router.get("/:sku", jwtAuth, productController.getProductBySku);

router.get("/image/:sku", jwtAuth, productController.getImageProductBySku);

router.patch("/updateActive/:sku", jwtAuth, authorize("Admin"), productController.updateActiveProduct);

router.patch("/update/:sku",
    jwtAuth,
    mongoUpload.single("image"),
    authorize("Admin"),
    productController.updateProduct
);

module.exports = router;