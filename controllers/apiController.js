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