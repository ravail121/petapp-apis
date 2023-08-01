const router = require("express").Router();
const { dashboardController } = require("../controllers");
const {authMiddleware} = require("../middlewares");



// Get total Products
router.get("/stats", authMiddleware.authenticate ,  dashboardController.getDashboardStats);



router.post("/revenue" , authMiddleware.authenticate , dashboardController.getProductsRevenue)




module.exports = router;