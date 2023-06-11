'use strict'
require('dotenv').config()
const express = require('express');
const connectdb = require('./database/connection');
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());


connectdb()

// endpoins
app.use("/api/v1", require("./router"));

// global error handler
app.use((err, req, res, next) => {
    if (err.message.details) {
        res.status(err.status).json({ status: err.status, message: err.message.details[0].message })
    } else if (err.message) {
        res.status(err.status).json({ status: err.status, message: err.message })
    }
})

app.listen(port, (error) => {
    if (error) {
        console.log(error, "error in listening");
        return;
    }
    console.log(`listening on http://localhost:${port}`);
})