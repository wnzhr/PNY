const mongoose = require("mongoose");
const UserSchema = new User.Schema({

    name: {
        type: String,
        unique: false,
        required: true,
        trim: true,
    },

    contactNumber: {
        type: String,
        unique: true,
        require: true,
        trim: true,
    },

    location1: {
        type: String,
    },

    location2: {
        type: String,
    },

    location3: {
        type: String,
    },
});

const User = mongoose.model("Users", UserSchema);

//export the schema
module.exports = User;