const { GetAllRoutesFromRouter } = require("../../helpers/helperfuns");

const express = require("express");
const {
  validateSchema,
  validateParamsSchema,
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");
const {
  createPersonSchema,
  PersonMeta,
  PersonMetaParams,
  PersonMetaQueryParams,
} = require("../../schema/personschema/schema");
const {
  CreatePerson,
  AddPersonMeta,
  UpDatePersonMeta,
  DeletePersonMeta,
  GetPersonData,
  GetSinglePerson,
  GetPersonMetaData,
  GetMetaDataSingle,
  UpdatePersonData,
  DeletePerson,
} = require("../../controllers/personcontrollers/personcontroller");
const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");

const router = express.Router();
router
  .route("/")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(createPersonSchema, ["gender"]),
    CreatePerson
  )
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetPersonData);

router
  .route("/:personId")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetSinglePerson)
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(createPersonSchema, ["gender"]),
    UpdatePersonData
  )
  .delete(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), DeletePerson);

// Person Meta
router
  .route("/meta/:personId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateParamsSchema(PersonMetaParams),
    validateSchema(PersonMeta),
    AddPersonMeta
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonMetaQueryParams),
    validateSchema(PersonMeta),
    UpDatePersonMeta
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonMetaQueryParams),
    DeletePersonMeta
  )
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    GetPersonMetaData
  );

router
  .route("/meta/:personId/:metaId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    GetMetaDataSingle
  );

// get all routes in the person routes
const basePath = "/person";
const allPersonRoutes = GetAllRoutesFromRouter(router);
const personRoutes = allPersonRoutes.map((route) => {
  return {
    path: basePath + route.path,
    methods: route.methods,
  };
});
module.exports = { personRoutes };

module.exports = router;
