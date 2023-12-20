const express = require("express");
const Register = require("../../controllers/auth/regsiterContoller");
const router = express.Router();
const { RegistrationSchema } = require("../../schema/authschema/schema");
const { validateSchema } = require("../../middlewares/validationAuth");

router.route("/").post(validateSchema(RegistrationSchema), Register);

module.exports = router;
