const VerifyEmail = async (req, res, next) => {
  try {
    const user = req.user;
    const userExits = await req.db.findOne("users", { id: user.id });
    if (!userExits) {
      return res.status(401).json({ msg: "Your not authorized" });
    }

    if (userExits.verified === 0) {
      return res.status(401).json({
        msg: "Your not authorized, please verify your account or contact admin",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = VerifyEmail;
