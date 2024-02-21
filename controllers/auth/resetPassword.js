const { addHours, format } = require("date-fns");
const { SendEmailLink, checkExpireDate } = require("../../helpers/helperfuns");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const bcryptjs = require("bcryptjs");

const directory = path.join(__dirname, "..", "public", "resetform.html");
const errorDir = path.join(__dirname, "..", "templates", "failpage.ejs");

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await req.db.findOne("users", { email });
    if (!user) {
      return res.status(401).json({ msg: `No user with ${email} found` });
    }
    const userId = user.id;
    const token = require("crypto").randomBytes(64).toString("hex");
    const base_url = process.env.BASE_URL;
    const url = `${base_url}/resetpassword/${userId}/${token}`;
    const moreInfo = `
          <p>
           Your recieving this email because you requested a password reset. 
          </p>
          <p> If you did not request a password reset, please ignore this email.</p>
          <p><a href="${url}" class="btn" style="color: white;">Click Here</a> to reset your password.</p>`;
    const emailData = {
      info: moreInfo,
      recipientName: `${user.firstname} ${user.lastname}`,
      header: "Reset Password",
      title: `Hello ${user.firstname}`,
    };
    const expireDate = addHours(new Date(), 2);
    const formatdate = format(expireDate, "yyyy-MM-dd HH:mm:ss");
    const tokendb = {
      userId: userId,
      token: token,
      isActive: 1,
      expire: formatdate,
    };
    const response = await SendEmailLink(email, "Reset Password", emailData);
    if (!response) {
      return res.status(500).json({ msg: "Something went wrong try again" });
    }
    await req.db.insertOne("tokens", tokendb);
    res.status(200).json({ msg: "Check your email for a password reset link" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPasswordLink = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const errorPage = fs.readFileSync(errorDir, "utf8");
    let errordata = {
      message: "There was a problem reseting your password",
      text: "Contact support",
      link: "#",
      linktext: "Contact",
    };
    const user = req.db.findOne("users", { id: userId });
    if (!user) {
      errordata.message = "No user found";
      errordata.text = "Go to";
      errordata.link = "#";
      errordata.linktext = "Home";
      const page = ejs.render(errorPage, errordata);
      return res.status(402).send(page);
    }
    const tokendb = await req.db.findByConditions("tokens", {
      userId: userId,
      token: token,
      isActive: 1,
    });
    if (!tokendb.length > 0) {
      errordata.message = "No Token associated with the user";
      errordata.text = "Generate reset token";
      errordata.link = "#";
      errordata.linktext = "Regenerate Token";
      const page = ejs.render(errorPage, errordata);
      return res.status(402).send(page);
    }
    const expire = checkExpireDate(tokendb[0].expire);
    if (expire) {
      errordata.message = "Token has expired";
      errordata.text = "Generate reset token";
      errordata.link = "#";
      errordata.linktext = "Regenerate Token";
      const page = ejs.render(errorPage, errordata);
      return res.status(402).send(page);
    }
    const html = fs.readFileSync(directory, "utf8");
    res.status(200).send(html);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await req.db.findOne("users", { id: userId });
    if (!user) {
      return res.status(401).json({ msg: `No user found` });
    }
    const { password } = req.body;
    const hashedpassword = await bcryptjs.hash(password, 10);
    const response = await req.db.updateOne(
      "users",
      { id: userId },
      { password: hashedpassword }
    );
    if (!response) {
      return res.status(500).json({ msg: "Something went wrong try again" });
    }
    await req.db.findOneAndUpdate(
      "tokens",
      { userId: userId, isActive: 1 },
      { isActive: 0 }
    );
    res.status(200).json({ msg: "Password has been reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { resetPassword, resetPasswordLink, resetUserPassword };
