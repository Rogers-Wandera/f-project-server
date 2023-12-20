const express = require("express");
const { loginController } = require("../../controllers/auth/loginController");
const { validateSchema } = require("../../middlewares/validationAuth");
const { loginSchema } = require("../../schema/authschema/schema");
const router = express.Router();

router.route("/").post(validateSchema(loginSchema), loginController);

module.exports = router;
