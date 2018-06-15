const models = require('../models');
const iothub = require('../azure/iothub');
const storage = require('../azure/storage');

exports.data = (req, res) => {
  models.Observation.findAll({fromDate: req.query.fromDate}).then(result => {
    res.json({data: result});
  })
};

exports.pump = (req, res) => {
  const id = parseInt(req.params.id);
  const duration = parseInt(req.query.duration);

  if (![1,2,3].includes(id))
    return res.status(400).json({message: `No pump with id ${id} exists.`});

  if (duration < 1 || duration > 60)
    return res.status(400).json({message: 'Invalid duration'});

  iothub.invoke({methodName: `ToggleRelay${id}`, duration: duration})
    .then(result => res.json(result))
    .catch(error => res.status(400).json({message: 'Failed to invoke method ToggleRelay' + id}));
};

exports.invoke = (req, res) => {
  iothub.invoke({methodName: req.query.method, payload: req.query.payload || ''})
    .then(result => res.json(result))
    .catch(error => res.status(400).json({message: 'Failed to invoke method ' + req.query.method}));
};

exports.blobToken = (req, res) => {
  storage.getToken()
    .then(token => res.json({ token: token }))
    .catch(error => res.status(400).json({message: 'Failed to retrieve token'}));
};
