require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();


const Router = require("./routes");
app.use(express.json());
app.use(cors());
app.use(express.static( process.env.STATIC_DIR ));

const PORT = process.env.PORT || 8000;


// api.rubypets.co.uk/admin/*    ---->  For admin routes
// api.rubypets.co.uk/user/*     ---->  For user routes


app.use("/auth" , Router.auth);
app.use("/admin/orders" , Router.orders);
app.use("/admin/categories" , Router.categories);
app.use("/admin/products" , Router.products);
app.use("/admin/dashboard" , Router.dashboard);
app.use("/admin/queries" , Router.queries);

app.use("/user/categories" , Router.userCategories);
app.use("/user/products" , Router.userProducts);
app.use("/user/orders" , Router.userOrders);
app.use("/user/queries" , Router.userQueries);
app.use("/payment" , Router.paymentGateway)


app.get("/", async (req, res) => {
  res.json({ status: true, message: "Server is Running" });
});

const server = app.listen(PORT, () => {
  console.log(`Access Server at http://localhost:${PORT} `);
});

module.exports = server;