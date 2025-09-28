const Listing = require("../models/listing")
const Booking = require("../models/booking.js");

module.exports.index = async(req, res)=>{
    const { location } = req.query;

    let filter = {}; // returns all listings if not searching any location
    if (location) {
        filter.location = { $regex: location, $options: "i" }; // case-insensitive
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, location: location || "" });
};

module.exports.renderNewForm = async(req, res)=>{
    res.render("listings/new.ejs");
};



module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{ 
                path:"author",
            },
        })
        .populate("owner");

    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    const bookings = await Booking.find({ listing: id });

    res.render("listings/show.ejs", { listing, bookings });  // pass both
};


module.exports.createListing = async(req, res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename) ;
    // console.log(req.file);
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};

module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }

    let oringalImageUrl = listing.image.url;
    oringalImageUrl = oringalImageUrl.replace("/upload", "/upload/w_250/e_blur:300");
    res.render("listings/edit.ejs", {listing, oringalImageUrl});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});


    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }


    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};