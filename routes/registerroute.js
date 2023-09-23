const express = require("express");
const Register = require("../controllers/regsiterContoller");
const router = express.Router();
const { RegistrationSchema } = require("../schema/schema");
const { validateSchema } = require("../middlewares/validationAuth");

router.route("/").post(validateSchema(RegistrationSchema), Register);

module.exports = router;
