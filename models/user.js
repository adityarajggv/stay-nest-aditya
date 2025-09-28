const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose); // auto generate username , password in schema

module.exports = mongoose.model('User', userSchema);