'use strict'
require('dotenv').config()
const express = require('express');
const connectdb = require('./database/connection');
const app = express();
const port = process.env.PORT || 5000


connectdb()



app.listen(port, (error) => {
    if (error) {
        console.log(error, "error in listening");
        return;
    }
    console.log(`listening on http://localhost:${port}`);
})