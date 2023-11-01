const bcryptjs = require("bcryptjs");
const { format } = require("date-fns");
const jwt = require("jsonwebtoken");
const userRoles = require("../conn/rolesList");
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await req.db.findOne("users", { email });
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
    const dbroles = await req.db.findByConditions("roles", {
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
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
    await req.db.updateOne(
      "users",
      { id: user.id },
      { lastloginDate: format(new Date(), "yyyy-MM-dd HH:mm:ss") }
    );
    res.status(200).json({
      msg: `Successfully signed in as ${user.firstname}`,
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginController };