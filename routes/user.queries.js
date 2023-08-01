const router = require("express").Router();
const { queryController } = require("../controllers");


// add order
router.post("/add" ,  queryController.addQuery);



module.exports = router;