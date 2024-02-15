const userdetails = async (req, res) => {
  try {
    const userdetails = await req.db.FindSelectiveOne("users", {
      id: req.user.id,
    });
    res.status(200).json(userdetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { userdetails };
