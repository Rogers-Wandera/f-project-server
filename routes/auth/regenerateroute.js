const express = require("express");
const router = express.Router();
const {
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const { regenerateSchema } = require("../../schema/authschema/schema");
const regenerateToken = require("../../controllers/auth/regenerate");

router
  .route("/")
  .get(validateQueryParamsSchema(regenerateSchema), regenerateToken);

module.exports = router;
