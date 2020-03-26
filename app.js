var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var suggestions = require('./suggestions');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// The api of the test
app.get("/suggestions", async function (req, res) {
    var ret = await suggestions.getSuggestions(req.query);
    res.json(ret);
});

module.exports = app;
