const express = require("express");
const {
  AddLinkroles,
  UpdateLinkroles,
  DeleteLinkroles,
  ViewLinkroles,
  ViewSingleLinkroles,
  getUserModules,
  getUserRolesTypes,
  getUserLinkRoles,
} = require("../../controllers/admin/linkrolescontroller.js");
const {
  linkrolesSchema,
  linkrolesQueryParams,
} = require("../../schema/adminschema/linkrolesschema.js");
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
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), ViewLinkroles)
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(linkrolesSchema),
    AddLinkroles
  );
router
  .route("/:linkroleId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleLinkroles
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(linkrolesSchema),
    UpdateLinkroles
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeleteLinkroles
  );

//   user roles
router
  .route("/user/view")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.User, USER_ROLES.Admin, USER_ROLES.Editor),
    getUserModules
  );

router
  .route("/assign/roles/:userId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    getUserRolesTypes
  );

router
  .route("/assigned/roles/:userId")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), getUserLinkRoles);
module.exports = router;
