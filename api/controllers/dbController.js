const data = db => (req, res) => {
  // TODO fetch this from db
  res.status(200).json({
    data: {
      Response: []
    }
  });
}

const upload = db => (req, res) => {
  db.collection('measures').insertOne(req.body);
  res.status(200).json({
    data: {
      Response: []
    }
  });
}

const dbController = db => ({
  data: data(db),
  upload: upload(db),
});

module.exports = dbController;
