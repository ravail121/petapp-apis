const authController = require("./auth.controller")
const categoryController = require("./categories.controller");
const productController = require("./products.controller");
const dashboardController = require("./dashboard.controller");
const ordersController = require("./orders.controller");
const queryController = require("./queries.controller");
const paymentGatewayController = require("./payment.gateway.controller");

module.exports = {
    authController,
    categoryController,
    productController,
    dashboardController,
    ordersController,
    queryController,
    paymentGatewayController
};