const { PORT } = require('./config');

// Express routing
const express = require('express');
const userRouter = express.Router();
const piRouter = express.Router();
const bodyParser = require('body-parser');
const app = express();
const controllers = require('./controllers');
const { database } = require('./utilities');

// Helmet for security best practise
const helmet = require('helmet')
app.use(helmet())

const cors = require('cors');
app.use(cors());

// Configure the app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication
const passport = require('./utilities/passport');
app.use(passport.initialize());

// Connect to database
database().then(db => {
  const {
    usersController,
    iothubController,
    dbController,
  } = controllers(db);

  /************ ROUTES FOR FRONTEND APP ************/

  // Login with username and password
  app.use('/api/login', passport.authenticateLocal());
  app.post('/api/login', usersController.login);

  // Retrieve graph data
  app.get('/api/data', dbController.data);

  // Use bearer authentication for other routes
  userRouter.use('/', passport.authenticateBearer());

  // Logout route
  userRouter.get('/logout', usersController.logout);

  // Invoke device method
  userRouter.get('/invoke', iothubController.invoke);

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
