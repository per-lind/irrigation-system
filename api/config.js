const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

const IOTHUB_CONNECTION = process.env.IOTHUB_CONNECTION;
const IOTHUB_DEVICE_ID = process.env.IOTHUB_DEVICE_ID;

// Database connection
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_SERVICE_HOST = process.env.MONGODB_SERVICE_HOST;
const MONGODB_SERVICE_PORT = process.env.MONGODB_SERVICE_PORT;

const MONGODB_CONNECTION = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}`;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

// Tokens for pi app
const AUTH_TOKEN = process.env.AUTH_TOKEN;

module.exports = {
  PORT,
  JWT_SECRET,
  IOTHUB_CONNECTION,
  IOTHUB_DEVICE_ID,
  MONGODB_CONNECTION,
  MONGODB_DATABASE,
  AUTH_TOKEN,
};
