require('dotenv').config()

//Express routing
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// Helmet for security best practise
var helmet = require('helmet')
app.use(helmet())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app);

module.exports = app;
