// const cronjob = require("node-cron");S
const fs = require("fs");
const path = require("path");

const RemoveFolder = (folder) => {
  try {
    const pathdir = path.join(__dirname, "..", folder);
    if (fs.existsSync(pathdir)) {
      fs.rmSync(pathdir, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { RemoveFolder };
