const express = require("express");
const {
  getImagesInFolder,
} = require("../../controllers/personcontrollers/personimages/personimagecontroller");
const router = express.Router();
router.route("/").get(getImagesInFolder);

module.exports = router;
