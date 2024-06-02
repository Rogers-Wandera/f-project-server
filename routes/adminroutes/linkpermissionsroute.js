const express = require("express");
const {
  AddLinkpermissions,
  UpdateLinkpermissions,
  DeleteLinkpermissions,
  ViewLinkpermissions,
  ViewSingleLinkpermissions,
  ViewCustomPermissions,
} = require("../../controllers/admin/linkpermissionscontroller.js");
const {
  linkpermissionsSchema,
} = require("../../schema/adminschema/linkpermissionsschema.js");
const { validateSchema } = require("../../middlewares/validationAuth");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const router = express.Router();
router
  .route("/permissions/:linkId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewLinkpermissions
  )
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(linkpermissionsSchema),
    AddLinkpermissions
  );
router
  .route("/:linkpermissionId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSingleLinkpermissions
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(linkpermissionsSchema),
    UpdateLinkpermissions
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeleteLinkpermissions
  );

router
  .route("/linkpermission/:linkId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewCustomPermissions
  );
module.exports = router;
