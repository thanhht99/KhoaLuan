const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get("/sync/auth", dataController.auth);

module.exports = router;