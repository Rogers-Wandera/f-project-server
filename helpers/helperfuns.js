const crypto = require("crypto");
const { isBefore, parse, format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { sendEmail } = require("../controllers/sendEmail");

const directory = path.join(__dirname, "..", "templates", "mailtemp.ejs");
const algorithm = "aes-256-cbc";
const initVector = crypto.randomBytes(32);
const secret_key = crypto.randomBytes(64);

function encrypt(data) {
  const cipher = crypto.createCipheriv(algorithm, secret_key, initVector);
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, secret_key, initVector);
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

function checkExpireDate(date) {
  const newdate = new Date(date);
  const fm = format(newdate, "yyyy-MM-dd HH:mm:ss");
  const parsedDate = parse(fm, "yyyy-MM-dd HH:mm:ss", new Date());
  const currentDate = new Date();
  return isBefore(parsedDate, currentDate);
}

const SendEmailLink = async (email, subject, emailData) => {
  try {
    const template = fs.readFileSync(directory, "utf-8");
    const emailHtml = ejs.render(template, emailData);
    const response = await sendEmail(email, subject, emailHtml);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  encrypt,
  decrypt,
  checkExpireDate,
  SendEmailLink,
};