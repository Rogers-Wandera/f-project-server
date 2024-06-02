const express = require("express");
const {
  AddSystemroles,
  UpdateSystemroles,
  DeleteSystemroles,
  ViewSystemroles,
  ViewSingleSystemroles,
  NotAsignedRoles,
} = require("../../controllers/auth/systemrolescontroller.js");
const {
  systemrolesSchema,
  systemrolesQueryParams,
} = require("../../schema/authschema/systemrolesschema.js");
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
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    ViewSystemroles
  )
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer),
    validateSchema(systemrolesSchema),
    AddSystemroles
  );
router
  .route("/:systemroleId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    ViewSingleSystemroles
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer),
    validateSchema(systemrolesSchema),
    UpdateSystemroles
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer),
    DeleteSystemroles
  );

router
  .route("/unassigned/:userId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer, USER_ROLES.Admin),
    NotAsignedRoles
  );
module.exports = router;
