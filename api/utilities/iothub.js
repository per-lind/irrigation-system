const { IOTHUB_CONNECTION, IOTHUB_DEVICE_ID } = require('../config');
const AzureClient = require('azure-iothub').Client;

// Invoke callback timeout
const timeoutInSeconds = 10;

// IOT HUB Connection
const client = AzureClient.fromConnectionString(IOTHUB_CONNECTION);

const iothub = {
  invoke: ({ methodName, payload }) => {
    return new Promise((resolve, reject) => {
      return client.invokeDeviceMethod(IOTHUB_DEVICE_ID, { timeoutInSeconds, methodName, payload }, (error, result) => {
        if (error) {
          console.error('Failed to invoke method \'' + methodName + '\': ' + JSON.stringify(payload));
          reject(error);
        } else {
          console.log(methodName + ' on ' + IOTHUB_DEVICE_ID + ':');
          console.log(JSON.stringify(result, null, 2));
          resolve(result);
        }
      });
    });
  }
};

module.exports = iothub;
