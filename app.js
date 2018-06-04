require('dotenv').config()

//Express routing
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Helmet for security best practise
const helmet = require('helmet')
app.use(helmet())

const cors = require('cors');
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app);

const port = process.env.PORT || 3001
app.listen(port);

module.exports = app;
