const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

const IOTHUB_CONNECTION = process.env.IOTHUB_CONNECTION;
const IOTHUB_DEVICE_ID = process.env.IOTHUB_DEVICE_ID;

module.exports = {
  PORT,
  JWT_SECRET,
  IOTHUB_CONNECTION,
  IOTHUB_DEVICE_ID,
};
