const express = require("express");
const {
  AddRolepermissions,
  UpdateRolepermissions,
  DeleteRolepermissions,
  ViewRolepermissions,
  ViewSingleRolepermissions,
} = require("../../controllers/admin/rolepermissionscontroller.js");
const {
  rolepermissionsSchema,
  rolepermissionsQueryParams,
} = require("../../schema/adminschema/rolepermissionsschema.js");
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
  .route("/user/:linkId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewRolepermissions
  )
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(rolepermissionsSchema),
    AddRolepermissions
  );
router
  .route("/:rolepermissionId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleRolepermissions
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(rolepermissionsSchema),
    UpdateRolepermissions
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeleteRolepermissions
  );
module.exports = router;
