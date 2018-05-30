var azure = require('azure-storage');
var moment = require('moment');
var blobService = azure.createBlobService();
var containerName = 'iot-data';

exports.invoke = (req, res, client, deviceId) => {
    var methodParams = {
        methodName: req.query.method,
        payload: req.query.payload || '',
        timeoutInSeconds: 10
    };
    
    client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
        if (err) {
            console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
            res.json(err)
        } else {
            console.log(methodParams.methodName + ' on ' + deviceId + ':');
            console.log(JSON.stringify(result, null, 2));
            res.json(result)
        }
    });
}

exports.blobSAS = (req, res) => {
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 45);
    startDate.setMinutes(startDate.getMinutes() - 100);
    
    const sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ+ azure.BlobUtilities.SharedAccessPermissions.LIST,
            Start: startDate,
            Expiry: expiryDate
        }
    };
    
    const token = blobService.generateSharedAccessSignature(containerName, null, sharedAccessPolicy);
    console.log(token);
    res.json(
        {
            sasToken: token,
            sasExpiry: expiryDate,
        });
}