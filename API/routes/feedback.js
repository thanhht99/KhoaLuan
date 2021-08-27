const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const feedbackController = require('../controllers/feedbackController');
const { authorize } = require("../middleware/authorize");

router.post("/:id", jwtAuth, feedbackController.feedback);

module.exports = router;