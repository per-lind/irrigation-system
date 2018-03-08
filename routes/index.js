module.exports = (app) => {
  app.use("/", require('./frontend'))
  app.use("/api", require('./backend'))
}

