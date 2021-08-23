const express = require("express");
const Record = require('../models/profile-object');
const multer = require

const router = express.Router();

router.post("/profile", (req,res) => {
  console.log("reached profile-function.js")
})
module.exports = router;
