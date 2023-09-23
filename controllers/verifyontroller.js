const { checkExpireDate } = require("../helpers/helperfuns");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const successDir = path.join(__dirname, "..", "templates", "successpage.ejs");
const errorDir = path.join(__dirname, "..", "templates", "failpage.ejs");

const Verify = async (req, res) => {
  try {
    const { userId, token } = req.query;
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
      text: "Go to login page",
      link: "somewhere",
      linktext: "Login",
    };
    const user = await req.db.findOne("users", { id: userId });
    if (!user) {
      errordata.message = "No user found";
      const pageErr = ejs.render(errorPage, errordata);
      return res.status(401).send(pageErr);
    }
    if (user.verified === 1) {
      errordata.message = "User already verified";
      errordata.text = "Go to login page";
      errordata.link = "somewhere";
      errordata.linktext = "Login";
      const pageErr = ejs.render(errorPage, errordata);
      return res.status(401).send(pageErr);
    }
    const tokendb = await req.db.findByConditions("tokens", {
      token: token,
      userId: userId,
      isActive: 1,
    });
    errordata.message = "No token associated with the user";
    errordata.text = "Please click here to. ";
    errordata.link = "regenerate?userid=" + userId;
    errordata.linktext = "Regenerate Code";
    const pageErrr = ejs.render(errorPage, errordata);
    if (!tokendb.length > 0) {
      return res.status(401).send(pageErrr);
    }
    const checkepire = checkExpireDate(tokendb[0].expire);
    if (checkepire) {
      return res.status(401).send(pageErrr);
    }
    await req.db.updateOne("users", { id: userId }, { verified: 1 });
    await req.db.updateOne("tokens", { id: tokendb[0].id }, { isActive: 0 });
    successdata.message = `Hello ${user.firstname}! Your account has been verified`;
    const successpage = ejs.render(successPage, successdata);
    res.status(200).send(successpage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = Verify;
