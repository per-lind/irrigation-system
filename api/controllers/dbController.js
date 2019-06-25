const data = db => (req, res) => {
  // Time interval for the query
  const endTime = req.query.endTime;
  const startTime = req.query.startTime;
  // Which methods we're interested in (default: all)
  const methods = req.query.methods || [];
  // Build query
  const timestamp = { "timestamp": { $gte: startTime, $lt: endTime } };
  const measures = []
  methods.forEach(item => {
    measures.push({ [`measures.${item}`]: { $exists: true } });
  });
  // Build query
  db
    .collection('measures')
    .find({
      $and: [
        timestamp,
        {
          $or: measures
        }
      ]
    })
    .sort({timestamp:1})
    .limit(2000) // Just in case...
    .toArray(function(error, documents) {
      if (error) return res.status(500);
      res.status(200).json({
        data: documents
      });
    });
}

const upload = (db, websocket) => (req, res) => {
  const obj = req.body;
  console.log("Received new data: ", obj)
  // Validate presence of model, data and timestamp
  const { timestamp, model, data, deviceId } = obj;
  const errors = [];
  if (typeof timestamp !== 'string' || timestamp === '') {
    errors.push("timestamp must be given and have type string");
  }
  if (!["events", "measures", "errors"].includes(model)) {
    errors.push("model must be 'events', 'measures' or 'errors'");
  }
  if (typeof data !== 'object') {
    errors.push("data must be given and have type json");
  }
  if (errors.length > 0) {
    console.log("Payload not valid: ", errors)
    return res.status(400).json({ errors })
  }
  // Let's not save errors in database
  if (model == 'errors') {
    return websocket.broadcast("upload", { timestamp, model, data });
  }
  return db.collection(model).insertOne({ timestamp, deviceId, [model]: data })
    .then(() => {
      res.status(200).json({});
      websocket.broadcast("upload", { timestamp, model, data });
    })
    .catch(error => {
      console.log("Error when inserting document: ", error);
      res.status(500).json({});
    });
}

const events = (db) => (req, res) => {
  // Time interval for the query
  const endTime = req.query.endTime ;
  const startTime = req.query.startTime;
  // Which hw we're interested in (default: all)
  const hardware = req.query.hardware || [];
  // Build query
  const timestamp = { "timestamp": { $gte: startTime, $lt: endTime } };
  const events = []
  hardware.forEach(item => {
    events.push({ [`events.${item}`]: { $exists: true } });
  });
  return db
    .collection('events')
    .find({
      $and: [
        timestamp,
        {
          $or: events
        }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(2000) // Just in case...
    .toArray(function (error, documents) {
      if (error) return res.status(500);
      res.status(200).json({
        data: documents
      });
    });
}

const dbController = (db, websocket) => ({
  data: data(db),
  upload: upload(db, websocket),
  events: events(db),
});

module.exports = dbController;
