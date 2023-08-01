const router = require("express").Router();
const { productController } = require("../controllers");
const { route } = require("./auth.route");

// Get Product
// router.get("/list/:page/:limit", productController.getAllProducts);


// Get Product
router.get("/get/:id" ,  productController.getProduct);


// Get Product with some category ID
// router.get("/getby-category/:id/:page/:limit", productController.getProductByCategoryId);


// Filter Api
// router.post("/filter", productController.filter);



// Get Shuffled Peoducts List For homePage
router.get("/list/shuffled" ,  productController.getShuffledProducts);



// New API for getbycategory , get list and filters
router.post("/list" , productController.getAllByCategory_Filter_List)




module.exports = router;