module.exports = (app) => {
  app.use("/", require('./frontend')(app))
  app.use("/api", require('./backend'))
}

