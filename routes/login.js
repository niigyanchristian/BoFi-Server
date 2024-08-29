const express = require("express");

const { loginUser } = require("../controllers/auth");

const router = express.Router();

router.route("/").
  post(loginUser);


module.exports = router;