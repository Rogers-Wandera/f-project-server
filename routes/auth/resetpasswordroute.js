const express = require("express");
const {
  resetPassword,
  resetPasswordLink,
  resetUserPassword,
} = require("../../controllers/auth/resetPassword");
const {
  validateSchema,
  validateParamsSchema,
} = require("../../middlewares/validationAuth");
const {
  resetPasswordSchema,
  resetPasswordLinkSchema,
  resetUserPasswordParamsSchema,
  resetUserPasswordSchema,
} = require("../../schema/authschema/schema");
const { RequesteLimiter } = require("../../middlewares/ratelimiter");
const router = express.Router();

const limiter = RequesteLimiter(2);
const resetlimiter = RequesteLimiter(3);
router
  .route("/")
  .post(limiter, validateSchema(resetPasswordSchema), resetPassword);
router
  .route("/:userId/:token")
  .get(validateParamsSchema(resetPasswordLinkSchema), resetPasswordLink);

router
  .route("/:userId")
  .post(
    resetlimiter,
    validateParamsSchema(resetUserPasswordParamsSchema),
    validateSchema(resetUserPasswordSchema),
    resetUserPassword
  );

module.exports = router;
