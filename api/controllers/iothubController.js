const { iothub } = require('../utilities');

exports.invoke = (req, res) => {
  const payload = req.query.payload;
  iothub.invoke({ methodName: req.query.method, payload: payload ? JSON.parse(payload) : {} })
    .then(result => res.status(result.status).json(result.payload))
    .catch(error => res.status(400).json({ message: 'Failed to invoke method ' + req.query.method }));
};
