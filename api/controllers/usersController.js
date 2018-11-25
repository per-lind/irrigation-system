exports.login = (req, res) => {
  res.json({ token: req.token, user: req.user });
};

exports.logout = (req, res) => {
  res.json({});
};
