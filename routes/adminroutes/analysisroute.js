const express = require("express");
const USER_ROLES = require("../../conn/rolesList");
const {
  CountDataAnalysis,
  PredictionsAnalysis,
} = require("../../controllers/admin/analysiscontroller");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyRoles = require("../../middlewares/verifyRoles");

const router = express.Router();

router
  .route("/counts")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.User), CountDataAnalysis);

router
  .route("/predictions")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.User),
    PredictionsAnalysis
  );
module.exports = router;
