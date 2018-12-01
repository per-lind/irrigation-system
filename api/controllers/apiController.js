const { iothub } = require('../utilities');

exports.invoke = (req, res) => {
  iothub.invoke({ methodName: req.query.method, payload: req.query.payload || {}})
    .then(result => res.status(result.status).json(result.payload))
    .catch(error => res.status(400).json({ message: 'Failed to invoke method ' + req.query.method }));
};
