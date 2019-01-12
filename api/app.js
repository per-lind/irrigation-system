const { PORT } = require('./config');

// Express routing
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const { usersController, apiController } = require('./controllers');

// Helmet for security best practise
const helmet = require('helmet')
app.use(helmet())

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication
const passport = require('./utilities/passport');
app.use(passport.initialize());

// Login with username and password
app.use('/api/login', passport.authenticateLocal());
app.post('/api/login', usersController.login);

// Retrieve graph data
app.get('/api/data', apiController.data);

// Use bearer authentication for other routes
router.use('/', passport.authenticateBearer());

// Logout route
router.get('/logout', usersController.logout);

// Invoke device method
router.get('/invoke', apiController.invoke);

// Namespace routes
app.use('/api', router);

app.listen(PORT);

console.log(`Api app listening on port ${PORT}!`)

module.exports = app;
