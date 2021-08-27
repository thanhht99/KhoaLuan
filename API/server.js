const express = require("express");
require("dotenv").config();

const app = express();
const validator = require('express-validator');
const colors = require('colors');
const session = require('express-session');

const errorMiddleware = require("./middleware/errorMiddleware");
const { ConnectMongo } = require("./database/connectDB");
const MailService = require("./utility/mail");

const auth = require("./routes/auth");
const user = require("./routes/user");
const category = require("./routes/category");
const promotion = require("./routes/promotion");
const product = require("./routes/product");
const order = require("./routes/order");
const cart = require("./routes/cart");
const voucher = require("./routes/voucher");
const bill = require("./routes/bill");
const feedback = require("./routes/feedback");

// using MongoDB
ConnectMongo.getConnect();
MailService.init();

// middleware parse body
app.use(express.json());
app.use(validator());
app.use(session({
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000 },
    secret: 'S3cret',
    saveUninitialized: false,
    resave: true
}));

// routes
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/category", category);
app.use("/api/promotion", promotion);
app.use("/api/product", product);
app.use("/api/order", order);
app.use("/api/cart", cart);
app.use("/api/voucher", voucher);
app.use("/api/bill", bill);
app.use("/api/feedback", feedback);

// middleware error
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Hello QTD, I'm running at localhost:http://localhost:${process.env.PORT}`.red);
});