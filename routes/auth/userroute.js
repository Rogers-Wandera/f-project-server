const express = require("express");
const router = express.Router();
const VerifyJwt = require("../../middlewares/verifyJwt");
// const VerifyEmail = require("../../middlewares/verifyEmail");
const { userdetails } = require("../../controllers/auth/userdetails");

router.route("/").get(VerifyJwt, userdetails);
module.exports = router;
