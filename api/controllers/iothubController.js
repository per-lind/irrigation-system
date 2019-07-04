const { iothub } = require('../utilities');

let _list;

const invoke = db => (req, res) => {
  const { payload, method } = req.query;
  if (method === 'list' && _list) {
    return res.status(200).json(_list);
  }
  iothub.invoke({ methodName: method, payload })
    .then(({ status, payload }) => {
      if (method === 'list') {
        _list = payload;
      }
      // Send response to frontend
      res.status(status).json(payload);
    })
    .catch(error => res.status(400).json({ message: 'Failed to invoke method ' + req.query.method }));
};

const iothubController = db => ({
  invoke: invoke(db),
});

module.exports = iothubController;
