const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");

// Create a booking
router.post("/", isLoggedIn, async (req, res) => {
    const { listingId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time, compare only date

    // 1️⃣ Backend validation for past dates
    if (start < today || end < today) {
        req.flash("error", "You cannot book for past dates.");
        return res.redirect(`/listings/${listingId}`);
    }

    // 2️⃣ Validate that start date is before end date
    if (start > end) {
        req.flash("error", "Start date must be before end date.");
        return res.redirect(`/listings/${listingId}`);
    }

    // 3️⃣ Check for overlapping bookings
    const overlapping = await Booking.findOne({
        listing: listingId,
        $or: [
            {
                startDate: { $lte: end },
                endDate: { $gte: start }
            }
        ]
    });

    if (overlapping) {
        req.flash("error", "This listing is already booked during that time.");
        return res.redirect(`/listings/${listingId}`);
    }

    // 4️⃣ Save booking
    const booking = new Booking({
        listing: listingId,
        user: req.user._id,
        startDate: start,
        endDate: end
    });

    await booking.save();
    req.flash("success", "Successfully booked!");
    res.redirect(`/listings/${listingId}`);
});

// View user's bookings
router.get("/my-bookings", isLoggedIn, async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
    res.render("bookings/myBookings", { bookings });
});

module.exports = router;
