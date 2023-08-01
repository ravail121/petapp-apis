const router = require("express").Router();
const { ordersController } = require("../controllers");


// add order
router.post("/add" ,  ordersController.addOrder);

router.get("/shipping/costs" , ordersController.getShippingFee)


module.exports = router;