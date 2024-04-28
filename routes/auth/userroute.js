const express = require("express");
const router = express.Router();
const VerifyJwt = require("../../middlewares/verifyJwt");
const {
  userdetails,
  getUsers,
  deleteUser,
  GetSingleUserDetails,
} = require("../../controllers/auth/userdetails");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");

router.route("/").get(VerifyJwt, userdetails);
router
  .route("/users")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    getUsers
  );

router
  .route("/users/:userId")
  .delete(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), deleteUser)
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.User),
    GetSingleUserDetails
  );
module.exports = router;
