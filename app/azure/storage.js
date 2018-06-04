var storage = require('azure-storage');
var blobService = storage.createBlobService();
var containerName = 'iot-data';

const getToken = (req, res) => {
  // Start and expiry time for token
  const startDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + 45);
  startDate.setMinutes(startDate.getMinutes() - 100);

  const sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: storage.BlobUtilities.SharedAccessPermissions.READ+ storage.BlobUtilities.SharedAccessPermissions.LIST,
      Start: startDate,
      Expiry: expiryDate
    }
  };

  // Generate access token
  const token = blobService.generateSharedAccessSignature(containerName, null, sharedAccessPolicy);

  return Promise.resolve({
    token: token,
    expiresAt: expiryDate,
  });
}

exports.getToken = getToken;
