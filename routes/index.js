// start of routes imports
const RegisterRoute = require("./auth/registerroute");
const ResetPassword = require("./auth/resetpasswordroute");
const AdminRoute = require("./adminroutes/adminroutes");
const VerifyRoute = require("./auth/verifyroute");
const RegenerateRoute = require("./auth/regenerateroute");
const PersonRoute = require("./personroutes/createPerson");
const PersonImageRoute = require("./personroutes/personimages");
const PersonFolder = require("./personroutes/personfolder");
const PersonAudioRoute = require("./personroutes/personaudio");
const UserRoute = require("./auth/userroute");
const ModulesRouter = require("./adminroutes/modules");
const LoginRoute = require("./auth/loginroute");
const LinkrolesRouter = require("./adminroutes/linkrolesroute.js");
const PositionsRouter = require("./adminroutes/positionsroute.js");
const UserprofileimagesRouter = require("./auth/userprofileimagesroute.js")
// end of routes imports

const router = require("express").Router();

// routes
router.use(`/register`, RegisterRoute);
router.use(`/admin`, AdminRoute);
router.use(`/verify`, VerifyRoute);
router.use(`/regenerate`, RegenerateRoute);
router.use(`/resetpassword`, ResetPassword);
router.use(`/login`, LoginRoute);
router.use(`/person`, PersonRoute);
router.use(`/person/images`, PersonImageRoute);
router.use(`/folder`, PersonFolder);
router.use(`/person/audio`, PersonAudioRoute);
router.use(`/user`, UserRoute);
router.use(`/modules`, ModulesRouter);
router.use(`/modules/linkroles`, LinkrolesRouter);
router.use(`/positions`, PositionsRouter);
router.use(`/userprofiles`, UserprofileimagesRouter);
//end of routes

module.exports = router;
