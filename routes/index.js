const auth = require("./auth.route");
const categories = require("./categories.route");
const products = require("./products.route");
const dashboard = require("./dashboard.route");
const userCategories = require("./user.categories");
const userProducts = require("./user.products");
const orders = require("./orders.route");
const queries = require("./queries.route");
const userOrders = require("./user.orders");
const userQueries = require("./user.queries");
const paymentGateway = require("./payment.gateway.route");

module.exports = {
    auth,
    categories,
    products,
    dashboard,
    userCategories,
    userProducts,    
    orders , 
    queries,
    userOrders,
    userQueries,
    paymentGateway
};