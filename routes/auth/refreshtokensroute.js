const express = require("express");
const {
  ViewSingleRefreshtokens,
  HandleRefreshToken,
} = require("../../controllers/auth/refreshtokenscontroller.js");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const verifyRefreshToken = require("../../middlewares/verifyRefreshToken.js");
const router = express.Router();
router
  .route("/:userId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleRefreshtokens
  )
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.User),
    verifyRefreshToken,
    HandleRefreshToken
  );

module.exports = router;
