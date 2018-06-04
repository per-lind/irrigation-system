const config = require('../../config');
const AzureClient = require('azure-iothub').Client;

// IOT HUB Connection
const client = AzureClient.fromConnectionString(config.iothubconnection);

const iothub = {
  invoke: (query) => {
    return new Promise((resolve, reject) => {
      return client.invokeDeviceMethod(config.deviceId, {...{ timeoutInSeconds: 10 }, ...query}, (error, result) => {
        if (error) {
          console.error('Failed to invoke method \'' + query.methodName + '\': ' + error.message);
          reject(error);
        } else {
          console.log(query.methodName + ' on ' + config.deviceId + ':');
          console.log(JSON.stringify(result, null, 2));
          resolve(result);
        }
      });
    });
  }
};

module.exports = iothub;
