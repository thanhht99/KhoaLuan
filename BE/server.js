const express = require("express");
require("dotenv").config();

const colors = require("colors");
const app = express();
const PORT = 3000;

const { ConnectMongo } = require("./database/connectDB");

// using MongoDB
ConnectMongo.getConnect();

// middleware parse body
app.use(express.json());






app.get("/", (req, res, next) => {
    res.status(200).json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`.red);
});