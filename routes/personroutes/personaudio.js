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
  RecordPersonAudio,
  GetPersonAudio,
  PausePersonAudio,
  ResumePersonAudio,
  StopPersonAudio,
  UploadPersonAudio,
  CancelUpload,
  UploadAudioFromLocal,
  GetPersonAudioCloud,
  DeleteAudioCloudRecord,
  UploadMultiple,
  UploadMultipleAudioFromLocal,
  DeletePersonAudio,
} = require("../../controllers/personcontrollers/personaudios/personaudioscontroller");
const {
  PersonAudioSchema,
  PersonAudioParams,
  PersonMetaParams,
  PersonMultipleAudioSchema,
} = require("../../schema/personschema/schema");

router
  .route("/:personId")
  .get(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), GetPersonAudio)
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    DeletePersonAudio
  );
router
  .route("/startrecord/:personId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    RecordPersonAudio
  );

router
  .route("/pauserecord/:personId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    PausePersonAudio
  );

router
  .route("/resumerecord/:personId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    ResumePersonAudio
  );

router
  .route("/stoprecord/:personId")
  .post(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), StopPersonAudio);

router
  .route("/uploadaudio/:personId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(PersonAudioSchema),
    UploadPersonAudio
  )
  .delete(VerifyJwt, VerifyEmail, VerifyRoles(USER_ROLES.Admin), CancelUpload);

router
  .route("/multiple/:personId")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateSchema(PersonMultipleAudioSchema),
    UploadMultiple
  );

router
  .route("/uploadlocal")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonMetaParams),
    UploadAudioFromLocal
  );

router
  .route("/uploadlocalmultiple")
  .post(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonMetaParams),
    UploadMultipleAudioFromLocal
  );

router
  .route("/cloudaudio/:personId")
  .get(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    GetPersonAudioCloud
  )
  .delete(
    VerifyJwt,
    VerifyEmail,
    VerifyRoles(USER_ROLES.Admin),
    validateQueryParamsSchema(PersonAudioParams),
    DeleteAudioCloudRecord
  );

module.exports = router;
