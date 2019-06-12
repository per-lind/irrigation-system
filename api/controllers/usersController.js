exports.login = (req, res) => {
  res.json({ token: req.token, user: req.user });
};
