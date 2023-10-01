const { addHours, format } = require("date-fns");
const { SendEmailLink, checkExpireDate } = require("../helpers/helperfuns");

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
    const user = req.db.findOne("users", { id: userId });
    if (!user) {
      return res.status(402).json({ msg: "User not found" });
    }
    const tokendb = await req.db.findByConditions("tokens", {
      userId: userId,
      token: token,
    });
    if (!tokendb) {
      return res.status(402).json({ msg: "User not found" });
    }
    const expire = checkExpireDate(tokendb[0].expire);
    if (expire) {
      return res.status(401).json({ msg: "Token has expired already" });
    }
    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { resetPassword, resetPasswordLink };
