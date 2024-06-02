const express = require("express");
const {
  ViewModelevaluation,
  ViewSingleModelevaluation,
} = require("../../controllers/recognition/modelevaluationcontroller.js");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const router = express.Router();
router
  .route("/:type")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewModelevaluation
  );
router
  .route("/current/:type")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleModelevaluation
  );
module.exports = router;
