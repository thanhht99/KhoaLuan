const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const categoryController = require('../controllers/categoryController');
const { authorize } = require("../middleware/authorize");

router.get("/all", jwtAuth, authorize("Admin"), categoryController.getAllCategories);

router.post("/create", jwtAuth, authorize("Admin"), categoryController.createNewCategory);

router.patch("/update/:id", jwtAuth, authorize("Admin"), categoryController.updateCategory);

router.patch("/updateActive/:id", jwtAuth, authorize("Admin"), categoryController.updateActiveCategory);

router.delete("/delete/:id", jwtAuth, authorize("Admin"), categoryController.deleteCategory);

module.exports = router;