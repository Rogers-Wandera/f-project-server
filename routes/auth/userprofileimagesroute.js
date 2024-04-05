const express = require("express");
const {
  AddUserprofileimages,
  UpdateUserprofileimages,
  DeleteUserprofileimages,
  ViewUserprofileimages,
  ViewSingleUserprofileimages,
} = require("../../controllers/auth/userprofileimagescontroller.js");
const {
  userprofileimagesSchema,
  userprofileimagesQueryParams,
} = require("../../schema/authschema/userprofileimagesschema.js");
const {
  validateSchema,
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const router = express.Router();
router
  .route("/")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewUserprofileimages
  )
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(userprofileimagesSchema),
    AddUserprofileimages
  );
router
  .route("/:userprofileimageId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleUserprofileimages
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(userprofileimagesSchema),
    UpdateUserprofileimages
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeleteUserprofileimages
  );
module.exports = router;
