const express = require("express");
require("dotenv").config();

const validator = require('express-validator');
const colors = require("colors");
const app = express();
// const PORT = 4200;
const errorMiddleware = require("./middleware/errorMiddleware");

const { ConnectMongo } = require("./database/connectDB");
const MailService = require("./utility/mail");
const auth = require("./routes/auth");

// using MongoDB
ConnectMongo.getConnect();
MailService.init();

// middleware parse body
app.use(express.json());
app.use(validator());

// routes
app.use("/api/auth", auth);

app.get("/", (req, res, next) => {
    res.status(200).json({ success: true });
});

// middleware error
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Hello QTD, I'm running at localhost:http://localhost:${process.env.PORT}`.red);
});