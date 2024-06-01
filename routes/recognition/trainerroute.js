const express = require("express");
const {
  AddTrainer,
  ViewTrainer,
} = require("../../controllers/recognition/trainercontroller.js");
const {
  trainerSchema,
} = require("../../schema/recognitionschema/trainerschema.js");
const { validateSchema } = require("../../middlewares/validationAuth");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const router = express.Router();
router
  .route("/")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), ViewTrainer)
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(trainerSchema),
    AddTrainer
  );
module.exports = router;
