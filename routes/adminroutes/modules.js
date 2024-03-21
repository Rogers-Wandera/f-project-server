const express = require("express");
const router = express.Router();
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const {
  GetModules,
  AddModules,
  EditModules,
  RemoveModules,
  AddModuleLinks,
  UpdateModuleLinks,
  DeleteModuleLinks,
  GetModuleLinks,
} = require("../../controllers/admin/admincontrollers");
const { validateSchema } = require("../../middlewares/validationAuth");
const {
  ModulesSchema,
  modulelinksschema,
} = require("../../schema/adminschema/modulesschema");

router
  .route("/")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetModules)
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(ModulesSchema),
    AddModules
  );
router
  .route("/:moduleId")
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(ModulesSchema),
    EditModules
  )
  .delete(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), RemoveModules);

// module links
router
  .route("/links/:moduleId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(modulelinksschema),
    AddModuleLinks
  )
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetModuleLinks);

router
  .route("/links/:moduleId/:linkId")
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(modulelinksschema),
    UpdateModuleLinks
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeleteModuleLinks
  );

module.exports = router;
