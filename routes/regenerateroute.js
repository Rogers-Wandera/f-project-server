const express = require("express");
const router = express.Router();
const { validateQueryParamsSchema } = require("../middlewares/validationAuth");
const { regenerateSchema } = require("../schema/schema");
const regenerateToken = require("../controllers/regenerate");

router
  .route("/")
  .get(validateQueryParamsSchema(regenerateSchema), regenerateToken);

module.exports = router;
