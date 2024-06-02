const express = require("express");
const router = express.Router();
const {
  validateSchema,
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const {
  createTableSchema,
  AddRoleSchema,
  AddTempRolesSchema,
  GetTempRolesQueryParams,
} = require("../../schema/adminschema/schema");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const {
  CreateTable,
  AddRoles,
  RemoveRole,
  GetUserRoles,
  AssignTempRouteRoles,
  GetUserTempRoles,
  GetTempRolesMethods,
  RemoveTempRole,
  UploadImages,
  UploadAudio,
} = require("../../controllers/admin/admincontrollers");

router
  .route("/createtable")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(createTableSchema),
    CreateTable
  );

router
  .route("/roles")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(AddRoleSchema),
    AddRoles
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(AddRoleSchema),
    RemoveRole
  );
router
  .route("/roles/:userId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.User),
    GetUserRoles
  );

router
  .route("/roles/routes/:userId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(AddTempRolesSchema),
    AssignTempRouteRoles
  )
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetUserTempRoles)
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(GetTempRolesQueryParams),
    RemoveTempRole
  );

router
  .route("/routes/tempmethods")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(GetTempRolesQueryParams),
    GetTempRolesMethods
  );

router
  .route("/upload")
  .post(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), UploadImages);

router
  .route("/audioupload")
  .post(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), UploadAudio);

module.exports = router;
