const express = require('express');
const router = express.Router();
const { baseAuth } = require('../middleware/baseAuth');
const authController = require('../controllers/authController');

router.post("/signUp", baseAuth, authController.signUp);

router.post("/signUp/verifyCode/:id", baseAuth, authController.verifyCode);

module.exports = router;