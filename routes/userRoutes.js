const express = require("express");
const wrapAsync = require("../utilis/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares");
const userServices = require("../controllers/users");

router.route("/signup")
.get(userServices.signUpGet)
.post( wrapAsync( userServices.signUpPost));

router.route("/login")
.get(userServices.loginGet)
.post(saveRedirectUrl,
    passport.authenticate("local",{ failureRedirect : "/login", failureFlash : "Incorrect login Credentials"}),
    userServices.loginPost);

router.get("/logout",userServices.logout);   
module.exports = router;