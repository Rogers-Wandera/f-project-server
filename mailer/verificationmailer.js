const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { sendEmail } = require("../controllers/sendEmail");

const directory = path.join(__dirname, "..", "templates", "verify.ejs");

const sendVerification = async (email, name, link) => {
  try {
    const template = fs.readFileSync(directory, "utf-8");
    const emailData = {
      recipientName: name,
      serverData: "Please confirm registration",
      senderName: "C-CHAT",
      link: link,
    };
    const emailHtml = ejs.render(template, emailData);
    const response = await sendEmail(email, "Verify Your Email", emailHtml);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = sendVerification;
