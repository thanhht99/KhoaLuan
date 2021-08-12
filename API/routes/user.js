const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const userController = require('../controllers/userController');
const { authorize } = require("../middleware/authorize");
const mongoUpload = require("../middleware/mongoUpload");
const { ConnectMongo } = require('../database/connectDB');

router.get("/all", jwtAuth, authorize("Admin"), userController.getAllUsers);

router.get("/avatar", jwtAuth, authorize("Customer", "Saler"), userController.avatarUser);

router.get("/:userName", jwtAuth, userController.findUserByUserName);

router.patch("/updatePassword", jwtAuth, userController.updatePassword);

router.patch("/updateUser",
    jwtAuth,
    mongoUpload.single("image"),
    authorize("Customer", "Saler"),
    userController.updateUser
);

module.exports = router;