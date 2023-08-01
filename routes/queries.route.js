const router = require("express").Router();
const { queryController } = require("../controllers");
const {authMiddleware} = require("../middlewares");


// list all queries
router.get("/list", authMiddleware.authenticate  ,  queryController.getAllQueries);


// get single query details
router.get("/details/:id", authMiddleware.authenticate  ,  queryController.getQuery);


// reply to query
router.post("/reply/:id", authMiddleware.authenticate  ,  queryController.replyQuery);


// // get single order details
// router.get("/status/list", authMiddleware.authenticate  ,  ordersController.getOrderStatuses);





module.exports = router;