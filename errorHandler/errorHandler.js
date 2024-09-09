const { logEvent } = require("../middlewares/logs");

const errorHandler = (err, req, res) => {
  console.log("err");
  logEvent(`${err.name}: ${err.message}`, "errorLog.md");
  res.status(500).send(err.message);
  return;
  // next();
};

module.exports = errorHandler;
