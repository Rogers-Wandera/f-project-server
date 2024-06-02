const bcryptjs = require("bcryptjs");
const { format } = require("date-fns");
const jwt = require("jsonwebtoken");
const { encryptData } = require("../../helpers/helperfuns");
const Refreshtokens = require("../../models/refreshtokensmodel");
const loginController = async (req, res) => {
  try {
    const tokenobj = new Refreshtokens(req.db);
    const { email, password } = req.body;
    const user = await req.db.findOne("usersdata", { email });
    if (!user) {
      return res.status(401).json({ msg: `No user with ${email} found` });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Passwords donot match" });
    }
    if (parseInt(user.isLocked) === 1) {
      return res
        .status(401)
        .json({ msg: "Your account is locked contact admin" });
    }
    const dbroles = await req.db.findByConditions("user_roles", {
      userId: user.id,
      isActive: 1,
    });
    const roles = dbroles.map((r) => r.role);
    const accessToken = jwt.sign(
      {
        user: {
          displayName: `${user.firstname} ${user.lastname}`,
          roles: roles,
          id: user.id,
          isLocked: user.isLocked,
          verified: user.verified,
          adminCreated: user.adminCreated,
          position: user.position,
          image: encryptData(user.image),
        },
        sub: user.id,
      },
      process.env.JWT_SECRET,
      // it should expire in the next 1 hour
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      {
        user: {
          displayName: `${user.firstname} ${user.lastname}`,
          roles: roles,
          id: user.id,
          isLocked: user.isLocked,
          verified: user.verified,
          adminCreated: user.adminCreated,
          position: user.position,
          image: encryptData(user.image),
        },
        sub: user.id,
      },
      process.env.JWT_REFRESH,
      { expiresIn: "1d" }
    );
    await req.db.updateOne(
      "users",
      { id: user.id },
      { lastloginDate: format(new Date(), "yyyy-MM-dd HH:mm:ss") }
    );
    tokenobj.Token = refreshToken;
    tokenobj.UserId = user.id;
    tokenobj.createdBy = user.id;
    await tokenobj.AddRefreshtokens();
    req.io.emit("login", { userId: user.id });
    res.status(200).json({
      msg: `Successfully signed in as ${user.firstname}`,
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginController };
