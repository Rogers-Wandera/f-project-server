const { encryptData } = require("../../helpers/helperfuns");
const Refreshtokens = require("../../models/refreshtokensmodel");
const jwt = require("jsonwebtoken");
const ViewSingleRefreshtokens = async (req, res) => {
  try {
    const { refreshtokenId, userId } = req.params;
    const refreshtokens = new Refreshtokens(req.db);
    refreshtokens.Id = refreshtokenId;
    refreshtokens.UserId = userId;
    const data = await refreshtokens.ViewSingleRefreshtokens();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const HandleRefreshToken = async (req, res) => {
  try {
    const decoded = req.decoded;
    const user = await req.db.findOne("usersdata", { id: req.user.id });
    if (!user) {
      return res.status(401).json({ msg: `No user with ${email} found` });
    }
    if (!decoded) {
      throw new Error("No token found");
    }
    const dbroles = await req.db.findByConditions("user_roles", {
      userId: user.id,
      isActive: 1,
    });
    const roles = dbroles.map((r) => r.role);
    const token = jwt.sign(
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
      { expiresIn: "1h" }
    );
    res.status(200).json({
      msg: "Session updated successfully",
      data: token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  ViewSingleRefreshtokens,
  HandleRefreshToken,
};
