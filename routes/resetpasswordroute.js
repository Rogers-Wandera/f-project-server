const express = require("express");
const {
  resetPassword,
  resetPasswordLink,
} = require("../controllers/resetPassword");
const {
  validateSchema,
  validateParamsSchema,
} = require("../middlewares/validationAuth");
const {
  resetPasswordSchema,
  resetPasswordLinkSchema,
} = require("../schema/schema");
const { RequesteLimiter } = require("../middlewares/ratelimiter");
const router = express.Router();

const limiter = RequesteLimiter(2);
router
  .route("/")
  .post(limiter, validateSchema(resetPasswordSchema), resetPassword);
router
  .route("/:userId/:token")
  .get(validateParamsSchema(resetPasswordLinkSchema), resetPasswordLink);

module.exports = router;
