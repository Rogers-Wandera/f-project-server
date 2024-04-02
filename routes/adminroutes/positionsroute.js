const express = require("express");
const {
  AddPositions,
  UpdatePositions,
  DeletePositions,
  ViewPositions,
  ViewSinglePositions,
  getSelectFormatted,
} = require("../../controllers/admin/positionscontroller.js");
const {
  positionsSchema,
  positionsQueryParams,
} = require("../../schema/adminschema/positionsschema.js");
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
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), ViewPositions)
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(positionsSchema),
    AddPositions
  );
router
  .route("/:positionId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ViewSinglePositions
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(positionsSchema),
    UpdatePositions
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeletePositions
  );

router
  .route("/selects/view")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin, USER_ROLES.Programmer),
    getSelectFormatted
  );
module.exports = router;
