const express = require("express");
const router = express.Router();
const {
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const { tokenSchema } = require("../../schema/schema");
const Verify = require("../../controllers/verifyontroller");

router.route("/").get(validateQueryParamsSchema(tokenSchema), Verify);

module.exports = router;
