const authValidation = require("./auth.validation");
const categoryValidation = require("./categories.validation");
const productValidation = require("./products.validations");
const orderValidation = require("./orders.validation");
const customerQueryValidation = require("./query.validation");
const dashboardValidation = require("./dashboard.validation");
const paymentGatewayValidation = require("./payment.gateway.validations");


module.exports = {
    authValidation,
    categoryValidation,
    productValidation,
    orderValidation,
    dashboardValidation,
    customerQueryValidation,
    paymentGatewayValidation
};