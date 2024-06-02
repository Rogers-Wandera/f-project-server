const express = require("express");
const router = express.Router();
const {
  validateSchema,
  validateQueryParamsSchema,
} = require("../../middlewares/validationAuth");

const VerifyJwt = require("../../middlewares/verifyJwt");
const VerifyEmail = require("../../middlewares/verifyEmail");
const VerifyRoles = require("../../middlewares/verifyRoles");
const USER_ROLES = require("../../conn/rolesList");
const {
  AddPersonImage,
  DeletePersonImage,
  GetPersonImages,
  AddPersonImageMeta,
  UpdatePersonImageMeta,
  DeletePersonImageMeta,
  GetPersonImageMeta,
  getImagesInFolder,
  DeleteMultiplePersonImage,
  UploadTakenImage,
} = require("../../controllers/personcontrollers/personimages/personimagecontroller");
const {
  PersonImageSchema,
  PersonImageQueryParams,
  PersonImageMetaSchema,
  PersonImageMetaQueryParams,
  deletemanyimagesschema,
} = require("../../schema/personschema/schema");
const Joi = require("joi");

// person image
router
  .route("/:personId")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetPersonImages)
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(PersonImageSchema),
    AddPersonImage
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonImageQueryParams),
    DeletePersonImage
  );

// person image metadata
router
  .route("/meta/:personId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonImageQueryParams),
    GetPersonImageMeta
  )
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonImageQueryParams),
    validateSchema(PersonImageMetaSchema),
    AddPersonImageMeta
  )
  .patch(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonImageMetaQueryParams),
    validateSchema(PersonImageMetaSchema),
    UpdatePersonImageMeta
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonImageMetaQueryParams),
    DeletePersonImageMeta
  );

router
  .route("/multiple/delete/:personId")
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(deletemanyimagesschema),
    DeleteMultiplePersonImage
  );

router.route("/folder/:personId").get(getImagesInFolder);
router.route("/uploads/person/single/:personId").post(
  VerifyJwt,
  VerifyEmail,
  VerifyRoles(USER_ROLES.Admin),
  validateSchema(
    Joi.object({
      image: Joi.string().required().messages({
        "any.required": "image is required",
      }),
    })
  ),
  UploadTakenImage
);

module.exports = router;
