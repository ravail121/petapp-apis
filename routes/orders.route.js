const router = require("express").Router();
const { ordersController } = require("../controllers");
const {authMiddleware} = require("../middlewares");


// list all orders
router.get("/list", authMiddleware.authenticate  ,  ordersController.getAllOrders);


// get single order details
router.get("/details/:id", authMiddleware.authenticate  ,  ordersController.getOrders);


// get avaiable order status
router.get("/status/list", authMiddleware.authenticate  ,  ordersController.getOrderStatuses);


// update status of an order
router.post("/status/update/:id", authMiddleware.authenticate  ,  ordersController.updateOrderStatus);


// shipping settings
router.post("/shipping/costs/edit" , authMiddleware.authenticate , ordersController.updateShippingSettings)





module.exports = router;