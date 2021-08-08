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

// middleware error
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Hello QTD, I'm running at localhost:http://localhost:${process.env.PORT}`.red);
});