const router = require("express").Router();
const { paymentGatewayController } = require("../controllers");




// create payment intent
router.post("/create/intent" , paymentGatewayController.createIntent)




module.exports = router;