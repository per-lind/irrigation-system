const { PORT } = require('./config');

// Express routing
const express = require('express');
const userRouter = express.Router();
const piRouter = express.Router();
const bodyParser = require('body-parser');
const app = express();
const controllers = require('./controllers');
const utilities = require('./utilities');

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

  // Use bearer authentication for other routes
  userRouter.use('/', passport.authenticateBearer());

  // Retrieve graph data
  userRouter.get('/data', dbController.data);

  // Logout route
  userRouter.get('/logout', usersController.logout);

  // Invoke device method
  userRouter.get('/invoke', iothubController.invoke);

  // Method invoke history
  userRouter.get('/events', dbController.events);

  // Namespace routes
  app.use('/api', userRouter);

  /************ ROUTES FOR RASPBERRY PI ************/

  // Authentication for pi
  piRouter.use('/', passport.authenticatePi());

  // Upload data
  piRouter.post('/upload', dbController.upload);

  // Namespace routes
  app.use('/pi', piRouter);

  /*************************************************/

  app.listen(PORT);
  console.log(`Api app listening on port ${PORT}!`)
}).catch(error => {
  console.log("Failed to connect to MongoDB: ", error);
  process.exit(1);
});

module.exports = app;
