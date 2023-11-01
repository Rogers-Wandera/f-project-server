const { logEvent } = require("../middlewares/logs");

const errorHandler = (err, req, res, next) => {
  logEvent(`${err.name}: ${err.message}`, "errorLog.md");
  res.status(500).send(err.message);
};

module.exports = errorHandler;
