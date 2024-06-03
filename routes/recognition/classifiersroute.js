const express = require("express");
const {
  AddClassifiers,
  ViewClassifiers,
  ViewSingleClassifiers,
} = require("../../controllers/recognition/classifierscontroller.js");
const {
  classifiersSchema,
} = require("../../schema/recognitionschema/classifiersschema.js");
const { validateSchema } = require("../../middlewares/validationAuth");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const router = express.Router();
router
  .route("/")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), ViewClassifiers)
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(classifiersSchema),
    AddClassifiers
  );
router
  .route("/:classifierId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleClassifiers
  );
module.exports = router;
