const { database } = require('../utilities');

exports.data = (req, res) => {
  // TODO fetch this from db
  res.status(200).json({
    data: {
      Response: []
    }
  });
}

exports.upload = (req, res) => {
  // TODO send data to db
  console.log("received data!");
  console.log(req.body);
  res.status(200).json({
    data: {
      Response: []
    }
  });
}
