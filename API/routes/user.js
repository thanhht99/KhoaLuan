const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const userController = require('../controllers/userController');
const { authorize } = require("../middleware/authorize");
const mongoUpload = require("../middleware/mongoUpload");
const { ConnectMongo } = require('../database/connectDB');

// router.get("/updatePassword", jwtAuth, userController.updatePassword);

router.get("/all", jwtAuth, authorize("Admin"), userController.getAllUsers);

router.get("/avatar", jwtAuth, authorize("Customer", "Saler"), userController.avatarUser);

router.patch("/updatePassword", jwtAuth, userController.updatePassword);

router.patch("/updateUser",
    jwtAuth,
    mongoUpload.single("image"),
    authorize("Customer", "Saler"),
    userController.updateUser
);

router.get('/', jwtAuth, (req, res) => {
    res.status(200).json({ success: true });
})

module.exports = router;