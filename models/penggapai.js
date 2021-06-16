const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    name: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    picture: {
        type: String,
        required: false,
        trim: true
    },
    gender: {
        type: String,
        required: false,
        trim: true
    },
    areaOfActivity: {
        type: String,
        required: false,
        trim: true
    },
    comment: {
        type: String,
        required: false,
        trim: true
    }
});


UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (error, hash) {
        if (error) {
            return next(error);
        }
        user.password = hash;
        next();
    });
});

UserSchema.pre('save', function (next) {
    var self = this;
    User.find({ email: self.email }, function (err, doc) {
        if (!doc.length) {
            next();
        } else {
            console.log('user exists: ', self.email);
            next(new Error("Email already in use!"));
        }
    });
});

UserSchema.statics.cari = function (email, callback) {
    User.findOne({ email: email })
        .exec(function (error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, user);
        });
}

UserSchema.statics.search = function (kampung, callback) {
    User.find({ areaOfActivity: { "$regex": kampung, "$options": "i" } })
        .exec(function (error, users) {
            if (error) {
                return callback(error);
            } else if (!users) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, users);
        });
}

UserSchema.statics.adminCari = function (callback) {
    User.find({ _id: { $ne: "60c635fe390e952490851866" } })
        .exec(function (error, users) {
            if (error) {
                return callback(error);
            }
            return callback(null, users);
        });
}

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            //if the user exists, compare the hashed password to the new hash from req.body.password
            bcrypt.compare(password, user.password, function (error, result) {
                // if passwords are the same return the user
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

const User = mongoose.model('User', UserSchema);



/* UserSchema.statics.lookUp = function (area, callback) {
    User.find()
};
 */
module.exports = User;