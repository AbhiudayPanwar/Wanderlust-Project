const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync =  require('../utilis/wrapAsync.js');
const {validateReview,isLoggedIn, isAuthor} = require("../middlewares.js");``
const reviewServices = require("../controllers/reviews.js");

// Post Review route
router.post("/", isLoggedIn, wrapAsync(reviewServices.postReview));

//  Delete Review route
router.delete("/:rid", isLoggedIn, isAuthor , wrapAsync(reviewServices.destroyReview));

module.exports = router;
