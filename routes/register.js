const express = require("express");

const { registerUser, changePassword, editProfile, forgetPassword, verifyCode } = require("../controllers/auth");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/edit").post(editProfile);
// router.route('/forget').post(forgetPassword);
router.route('/verify_code').post(verifyCode);
router.route('/password').post(changePassword);

module.exports = router;