// Todo App
require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// Helmet for security best practise
var helmet = require('helmet')
app.use(helmet())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);

module.exports = app;
