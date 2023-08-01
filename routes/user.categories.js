const router = require("express").Router();
const { categoryController } = require("../controllers");

// List Categories
router.get("/list",   categoryController.getAllCategories);


// Get Category
router.get("/get/:id", categoryController.getCategory);



module.exports = router;