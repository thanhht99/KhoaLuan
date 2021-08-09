const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const userController = require('../controllers/userController');

router.patch("/updatePassword", jwtAuth, userController.updatePassword);

router.get('/', jwtAuth, (req, res) => {
    res.status(200).json({ success: true });
})

module.exports = router;