const express = require("express");
const router = express.Router();
const { validateSchema } = require("../../middlewares/validationAuth");
const { createTableSchema } = require("../../schema/schema");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");

router
  .route("/createtable")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(createTableSchema),
    async (req, res) => {
      try {
        const { tablename, columns } = req.body;
        const result = await req.db.createTable(tablename, columns);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

module.exports = router;
