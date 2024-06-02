const express = require("express");
const Register = require("../../controllers/auth/regsiterContoller");
const router = express.Router();
const { RegistrationSchema } = require("../../schema/authschema/schema");
const { validateSchema } = require("../../middlewares/validationAuth");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");

router.route("/").post(validateSchema(RegistrationSchema), Register);
router
  .route("/admin")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(RegistrationSchema),
    Register
  );
module.exports = router;
