const express = require("express");
const router = express.Router();
const listingServices = require("../controllers/listings.js");
const wrapAsync =  require('../utilis/wrapAsync.js');
const {isLoggedIn,isOwner,validateListing} = require("../middlewares.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

     
    router.route("/")  
    .get(wrapAsync(listingServices.index))  // Index Route 
    .post(isLoggedIn,
       upload.single("listing[image]"),
       wrapAsync( listingServices.newPost));  // Post listing route


    // New Route - written above show route so that /new is not mistaken for :id
    router.get('/new', isLoggedIn , listingServices.newForm);
    
    router.route("/:id")
    .get( wrapAsync(listingServices.showListing)) // Show Route
    .post( isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingServices.editPost)); // Post Edit Route
    
    // Edit Form Route 
    router.get('/:id/edit', isLoggedIn, isOwner,wrapAsync(listingServices.editForm));   
    
    // Delete Route
    router.get('/:id/delete', isLoggedIn , isOwner, wrapAsync(listingServices.destroy));

    module.exports = router;
    