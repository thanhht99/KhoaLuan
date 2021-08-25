const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const orderController = require('../controllers/orderController');
const { authorize } = require("../middleware/authorize");
const mongoUpload = require("../middleware/mongoUpload");

router.get("/allOrder", jwtAuth, authorize("Admin"), orderController.allOrder);

router.get("/", jwtAuth, orderController.orderOfUser);

router.post("/", jwtAuth, orderController.createOrder);

router.post("/changeOrderStatus/:id", jwtAuth, authorize("Admin", "Saler"),
    orderController.changeOrderStatus
);

router.patch("/updateActive/:id", jwtAuth, authorize("Admin", "Saler"), orderController.updateActiveOrder);

module.exports = router;