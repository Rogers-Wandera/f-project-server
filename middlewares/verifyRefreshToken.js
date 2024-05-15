const Refreshtokens = require("../models/refreshtokensmodel");
const jwt = require("jsonwebtoken");
const { logEvent } = require("./logs");

async function verifyRefreshToken(req, res, next) {
  try {
    const RefreshTokens = new Refreshtokens(req.db);
    RefreshTokens.userId = req.user.id;
    const token = await RefreshTokens.ViewSingleRefreshtokens();
    jwt.verify(token.token, process.env.JWT_REFRESH, async (err, decoded) => {
      if (err) {
        await logEvent(
          `Token Error: ${err.message} \n  User: ${req.user.displayName} id: ${req.user.id}`,
          "tokenLogs.md"
        );
        return res
          .status(401)
          .json({ msg: "Token expired logoff and login again" });
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = verifyRefreshToken;
