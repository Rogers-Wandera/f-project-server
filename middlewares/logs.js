const path = require("path");
const fsPromises = require("fs").promises;
const fs = require("fs");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvent = async (message, logFile) => {
  const date = `${format(new Date(), "yyMMdd\tHH:mm:ss")}`;
  const logTime = `${date}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      logTime
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.md");
  console.log(req.method, req.path);
  next();
};

module.exports = { logEvent, logger };
