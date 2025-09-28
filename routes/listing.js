const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js"); 
const upload = multer({ storage }); 

const Booking = require("../models/booking.js");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"), validateListing,wrapAsync(listingController.createListing));
    


// ("/listings/new")route ko upar rakhe nhi to new ko :id samajhkar error aayega
// New Route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
   .get(wrapAsync(listingController.showListing))   // show route
   .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) //update route
   .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)); //delete route

    
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




module.exports = router;