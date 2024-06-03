
        const express = require("express");
        const {AddPredictions, UpdatePredictions, DeletePredictions, ViewPredictions, ViewSinglePredictions} = require("../../controllers/recognition/predictionscontroller.js")
        const {predictionsSchema, predictionsQueryParams} = require("../../schema/recognitionschema/predictionsschema.js")
        const {
            validateSchema,
            validateQueryParamsSchema,
        } = require("../../middlewares/validationAuth");
        const VerifyJwt = require("../../middlewares/verifyJwt");
        const VerifyEmail = require("../../middlewares/verifyEmail");
        const VerifyRoles = require("../../middlewares/verifyRoles");
        const USER_ROLES = require("../../conn/rolesList");
        const router = express.Router();
        router.route('/').get(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),ViewPredictions)
    .post(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),validateSchema(predictionsSchema),AddPredictions)
    router.route("/:predictionId").get(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),ViewSinglePredictions)
    .patch(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),validateSchema(predictionsSchema),UpdatePredictions)
    .delete(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),DeletePredictions)
        module.exports = router;
    