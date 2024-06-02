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
  GetLastModuleLinkPosition,
  getSelectModules,
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
    VerifyRoles(USER_ROLES.Programmer),
    validateSchema(ModulesSchema),
    AddModules
  );
router
  .route("/:moduleId")
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer, USER_ROLES.Admin),
    validateSchema(ModulesSchema),
    EditModules
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer),
    RemoveModules
  );

// module links
router
  .route("/links/:moduleId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer),
    validateSchema(modulelinksschema),
    AddModuleLinks
  )
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    GetModuleLinks
  );

router
  .route("/links/:moduleId/:linkId")
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    validateSchema(modulelinksschema),
    UpdateModuleLinks
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Programmer),
    DeleteModuleLinks
  );

router
  .route("/links/position/:moduleId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    GetLastModuleLinkPosition
  );

router
  .route("/modules/selects/viewall")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    getSelectModules
  );

module.exports = router;
