const crypto = require("crypto");
const { isBefore, parse, parseISO, format } = require("date-fns");
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

module.exports = {
  encrypt,
  decrypt,
  checkExpireDate,
};
