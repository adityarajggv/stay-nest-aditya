// models/booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: Date,
    endDate: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
