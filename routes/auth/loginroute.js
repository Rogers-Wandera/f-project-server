const express = require("express");
const { loginController } = require("../../controllers/loginController");
const { validateSchema } = require("../../middlewares/validationAuth");
const { loginSchema } = require("../../schema/schema");
const router = express.Router();

router.route("/").post(validateSchema(loginSchema), loginController);

module.exports = router;
