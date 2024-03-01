const express = require("express");
const router = express.Router();
const {
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const { regenerateSchema } = require("../../schema/authschema/schema");
const regenerateToken = require("../../controllers/auth/regenerate");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const { RegenerateToken } = require("../../controllers/auth/regeneratecode");

router
  .route("/")
  .get(validateQueryParamsSchema(regenerateSchema), regenerateToken);
router
  .route("/code")
  .get(
    VerifyJwt,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.User, USER_ROLES.Editor),
    RegenerateToken
  );

module.exports = router;
