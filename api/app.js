const { PORT } = require('./config');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const utilities = require('./utilities');

// Express routing
const express = require('express');
const app = express();
const server = require('http').Server(app);
const websocket = utilities.websocket(server)

// Router for raspberry pi
const piRouter = express.Router();

// Helmet for security best practise
const helmet = require('helmet')
app.use(helmet())

const cors = require('cors');
app.use(cors());

// Configure the app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
utilities.database().then(db => {
  // Authentication
  const passport = utilities.passport(db)
  app.use(passport.initialize());

  const {
    usersController,
    iothubController,
    dbController,
  } = controllers(db);

  /************ HEALTH CHECK ************/
  app.get('/health', (req, res) => res.send("OK"));

  /************ ROUTES FOR FRONTEND APP ************/

  // Login with username and password
  app.use('/api/login', passport.authenticateLocal());
  app.post('/api/login', usersController.login);

  // Use bearer authentication for websocket routes
  websocket.auth(passport.authenticateToken());
  websocket.use(passport.authenticateToken());

  // Retrieve graph data
  websocket.message('data', dbController.data);

  // Invoke device method
  websocket.message('invoke', iothubController.invoke);

  // Method invoke history
  websocket.message('events', dbController.events);

  /************ ROUTES FOR RASPBERRY PI ************/

  // Authentication for pi
  piRouter.use('/', passport.authenticatePi());

  // Upload data
  piRouter.post('/upload', dbController.upload);

  // Namespace routes
  app.use('/pi', piRouter);

  /*************************************************/

  server.listen(PORT);
  console.log(`Api app listening on port ${PORT}!`)
}).catch(error => {
  console.log("Failed to start app: ", error);
  process.exit(1);
});

module.exports = app;
