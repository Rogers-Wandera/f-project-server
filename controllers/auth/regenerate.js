const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { format } = require("date-fns");
const SendVerification = require("../../mailer/verificationmailer");
const { addHours } = require("date-fns");
const { checkExpireDate } = require("../../helpers/helperfuns");

const successDir = path.join(__dirname, "..", "templates", "regenerate.ejs");
const errorDir = path.join(__dirname, "..", "templates", "failpage.ejs");

const regenerateToken = async (req, res) => {
  try {
    const { userId } = req.query;
    const errorPage = fs.readFileSync(errorDir, "utf8");
    const successPage = fs.readFileSync(successDir, "utf8");
    let errordata = {
      message:
        "There was a problem verifying your account. Please try again by refreshing the page",
      text: "Contact support",
      link: "#",
      linktext: "Contact",
    };
    const successdata = {
      message: "You have been verified successfully",
      text: "Go to home page",
      link: "somewhere",
      linktext: "Home",
    };
    const user = await req.db.findOne("users", { id: userId });
    const tokendb = await req.db.findByConditions("tokens", {
      userId: userId,
      isActive: 1,
    });
    if (!user) {
      errordata.message = "No user found";
      const page = ejs.render(errorPage, errordata);
      return res.status(401).send(page);
    }
    if (user.verified == 1) {
      errordata.message = "Already verified account";
      errordata.text = "Go to";
      errordata.link = "#";
      errordata.linktext = "Home";
      const page = ejs.render(errorPage, errordata);
      return res.status(401).send(page);
    }
    let checkexpire = true;
    if (tokendb.length > 0) {
      checkexpire = checkExpireDate(tokendb[0].expire);
    }
    if (!checkexpire) {
      errordata.message = `Please you still have an active token check your mail to verify your account, 
      check your spam folder if you didnt recieve the mail maybe or contact support, alternatively
      you can wait for 2 hours and check back for a new link`;
      const page = ejs.render(errorPage, errordata);
      return res.status(401).send(page);
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
      errordata.message = "Something went wrong";
      const page = ejs.render(errorPage, errordata);
      return res.status(401).send(page);
    }
    const verify = `${process.env.BASE_URL}/verify?userId=${userId}&token=${token}`;
    await SendVerification(
      user.email,
      `${user.firstname} ${user.lastname}`,
      verify
    );
    successdata.message = `Email sent to ${user.email}, please check your mail`;
    const successpage = ejs.render(successPage, successdata);
    return res.status(200).send(successpage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = regenerateToken;
