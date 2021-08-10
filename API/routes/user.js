const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const userController = require('../controllers/userController');
const { authorize } = require("../middleware/authorize");
const mongoUpload = require("../middleware/mongoUpload");


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