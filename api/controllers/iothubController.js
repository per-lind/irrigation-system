const { iothub } = require('../utilities');

const invoke = db => (req, res) => {
  const payload = req.query.payload;
  iothub.invoke({ methodName: req.query.method, payload })
    .then(result => {
      // Send response to frontend
      res.status(result.status).json(result.payload);
    })
    .catch(error => res.status(400).json({ message: 'Failed to invoke method ' + req.query.method }));
};

const iothubController = db => ({
  invoke: invoke(db),
});

module.exports = iothubController;
