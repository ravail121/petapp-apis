const router = require("express").Router();
const { ordersController } = require("../controllers");


// add order
router.post("/add" ,  ordersController.addOrder);

router.post("/check/products" , ordersController.checkOrderedProducts)

router.get("/shipping/costs" , ordersController.getShippingFee)


module.exports = router;