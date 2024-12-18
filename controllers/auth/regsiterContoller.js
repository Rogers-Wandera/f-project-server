const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const bcrptjs = require("bcryptjs");
const SendVerification = require("../../mailer/verificationmailer");
const { addHours } = require("date-fns");

const Register = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      password,
      adminCreated,
      gender,
      tel,
      position,
    } = req.body;
    const users = await req.db.findOne("users", { email: email });
    if (users) {
      return res.status(401).json({ msg: `User with ${email} already exists` });
    }
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const hashedPassword = await bcrptjs.hash(password, 10);
    const userid = uuid();
    const token = require("crypto").randomBytes(32).toString("hex");
    const expireDate = addHours(new Date(), 2);
    const formatdate = format(expireDate, "yyyy-MM-dd HH:mm:ss");
    const newuser = {
      id: userid,
      firstname,
      lastname,
      password: hashedPassword,
      email,
      createdAt,
      adminCreated,
      gender,
      tel,
      positionId: position,
      isLocked: 0,
      isActive: 1,
    };
    const result = await req.db.insertOne("users", newuser);
    if (!result?.success) {
      return res.status(500).json({ msg: "Something went wrong try again" });
    }
    let createdBy = userid;
    if (req.user) {
      createdBy = req.user.id;
    }
    const roles = {
      userId: userid,
      isActive: 1,
      createdBy: createdBy,
    };
    let additionaldata = "";
    if (adminCreated == 1) {
      additionaldata = [`Please login using this password ${password}`];
    }
    const tokendb = {
      userId: userid,
      token: token,
      isActive: 1,
      expire: formatdate,
    };
    await req.db.insertOne("roles", roles);
    await req.db.insertOne("tokens", tokendb);
    const verify = `${process.env.BASE_URL}/verify?userId=${userid}&token=${token}`;
    const response = await SendVerification(
      email,
      `${firstname} ${lastname}`,
      verify,
      additionaldata
    );
    res
      .status(200)
      .json({ msg: "User created successfully", emailsent: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = Register;
