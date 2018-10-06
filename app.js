const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const matchesRouter = require('./src/routes/matches');
const tournamentsRouter = require('./src/routes/tournaments');
const teamRouter = require('./src/routes/teams');
require('dotenv').config();


mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.set('useFindAndModify', false);

//HTTP request logger
app.use(morgan('dev'));

//parse request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cross-origin resource sharing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*');
        return res.status(200).json({});
    }
    next();
});

app.use('/matches', matchesRouter);
app.use('/tournaments', tournamentsRouter);
app.use('/teams', teamRouter);
//test helper
// app.use('/', require("./src/routes/test"));
/* ERROR HANDLING */

//
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        status: "error",
        message: error.message
    })
});

module.exports = app;
