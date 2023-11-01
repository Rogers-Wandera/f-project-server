const jwt = require("jsonwebtoken");

const VerifyJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ msg: "Your not authorized to view this route" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: "invalid token or Expired Token" });
      }
      req.user = {
        displayName: decoded.user.displayName,
        id: decoded.user.id,
      };
      req.roles = decoded.user.roles;
      next();
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = VerifyJwt;
