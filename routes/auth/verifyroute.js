const express = require("express");
const router = express.Router();
const {
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const { tokenSchema } = require("../../schema/authschema/schema");
const Verify = require("../../controllers/auth/verifyontroller");

router.route("/").get(validateQueryParamsSchema(tokenSchema), Verify);

module.exports = router;
