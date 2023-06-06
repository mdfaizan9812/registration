"use strict";

const mongoose = require('mongoose');

const DB_OPTIONS = {
    dbName: process.env.DBNAME
}

const connectdb = () => {
    try {
        mongoose.connect(process.env.DB_URL, DB_OPTIONS);
        console.log("DB connection established");
        return;
    } catch (error) {
        console.log(error, "error connecting");
    }
}

module.exports = connectdb;