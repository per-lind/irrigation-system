const data = db => (req, res) => {
  // Fetch data from db
  db.collection('measures').find().limit( 100 ).toArray(function(error, documents) {
    if (error) return res.status(500);

    res.status(200).json({
      Response: documents
    });
  });
}

const upload = db => (req, res) => {
  const data = req.body;
  console.log("Received new data: ", data)
  // Validate presence of measures and timestamp
  const { timestamp, measures } = data;
  const errors = [];
  if (typeof timestamp !== 'string' || timestamp === '') {
    errors.push("timestamp must be given and have type string");
  }
  if (typeof measures !== 'object') {
    errors.push("measures must be given and have type json");
  }
  if (errors.length > 0) {
    console.log("Payload not valid: ", errors)
    return res.status(400).json({ errors })
  }
  return db.collection('measures').insertOne(data)
    .then(res.status(200).json({}))
    .catch(error => {
      console.log("Error when inserting document: ", error);
      res.status(500).json({});
    });
}

const dbController = db => ({
  data: data(db),
  upload: upload(db),
});

module.exports = dbController;
