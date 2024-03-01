const { format } = require("date-fns");
const SendVerification = require("../../mailer/verificationmailer");
const { addHours } = require("date-fns");
const { checkExpireDate } = require("../../helpers/helperfuns");

const RegenerateToken = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await req.db.findOne("users", { id: userId });
    const tokendb = await req.db.findByConditions("tokens", {
      userId: userId,
      isActive: 1,
    });
    if (!user) {
      throw new Error("No user found");
    }
    if (user.verified == 1) {
      return res.status(200).json({ msg: "Already verified account" });
    }
    let checkexpire = true;
    if (tokendb.length > 0) {
      checkexpire = checkExpireDate(tokendb[0].expire);
    }
    if (!checkexpire) {
      throw new Error(`Please you still have an active token check your mail to verify your account, 
      check your spam folder if you didnt recieve the mail maybe or contact support, alternatively
      you can wait for 2 hours and check back for a new link`);
    }
    await req.db.findOneAndUpdate(
      "tokens",
      { userId: userId, isActive: 1 },
      { isActive: 0 }
    );
    const token = require("crypto").randomBytes(32).toString("hex");
    const expireDate = addHours(new Date(), 2);
    const formatdate = format(expireDate, "yyyy-MM-dd HH:mm:ss");
    const response = await req.db.insertOne("tokens", {
      userId,
      token,
      expire: formatdate,
      isActive: 1,
    });
    if (response?.success === false) {
      throw new Error("Something went Wrong");
    }
    const verify = `${process.env.BASE_URL}/verify?userId=${userId}&token=${token}`;
    await SendVerification(
      user.email,
      `${user.firstname} ${user.lastname}`,
      verify
    );
    const message = `Email sent to ${user.email}, please check your mail`;
    return res.status(200).send({ msg: message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { RegenerateToken };
