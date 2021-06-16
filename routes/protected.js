const express = require('express');
const router = express.Router();
const User = require('../models/penggapai');


router.post('/register', (req, res) => {
    if (req.body.email && req.body.name && req.body.password && req.body.password2) {
        //check for same pw
        if (req.body.password !== req.body.password2) {
            var err = new Error("Passwords do not match");
            err.status = 400;
            res.render('error', { errormessage: err })
            return next(err);
        }//end of second 1f
    }//end of 1st else
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        picture: req.body.picture,
        gender: req.body.gender,
        areaOfActivity: req.body.areaOfActivity,
        comment: req.body.comment
    });
    user.save(function (err) {
        if (err) {
            console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
                err = "An account with that email already exists. Login instead!"
                res.render('error', { errormessage: err })
            }//end of err.name === mongoerror
            else {
                res.render('error', { errormessage: "Username exists, please choose a different one!" })
            }
        }//if 1st err

        else {
            res.render('validation');
            console.log("working");
        }
    });//end of user.save

});

router.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        //use the authenticate method which takes the username and pass as parameters and then
        // runs a callback function which takes error and user as parameters
        User.authenticate(req.body.email, req.body.password, function (error, user) {

            //if there is either an error or user doesn't exist
            if (error || !user) {
                let err = new Error('Wrong email or password.');
                err.status = 401;
                res.render('loginError');
            } else if (req.body.email === "pnym2021@gmail.com") {
                req.session.userId = user.email;
                User.adminCari(function (error, penggapais) {
                    if (error) {
                        let err = new Error('Something bad happened');
                        err.status = 401;
                        res.render('loginError');
                    }

                    res.render('admin', { penggapais });
                });
            } else {
                //give the user a session id so that they can seamlessly navigate restricted pages
                req.session.userId = user._id;
                res.render('edittablePenggapai', {
                    loginStatus: { state: "Logout", url: "logout" },
                    picture: user.picture,
                    name: user.name,
                    gender: user.gender,
                    telephoneNumber: user.phoneNumber,
                    address: user.address,
                    areaOfActivity: user.areaOfActivity,
                    comment: user.comment
                });
            }
        });
    }
});

router.all('/search', (req, res) => {
    let kampung = req.body.kampung;
    User.search(kampung, function (error, penggapais) {
        if (error || !penggapais) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            res.render('noUser');
        } else {
            res.render('searchResults', { penggapais })
        }
    });
});

router.get('/', (req, res) => {
    let userId = req.query.userId;
    let sessionId = req.session.userId;
    User.cari(userId, function (error, user) {
        if (error || !user) {
            console.log(error);
            console.log(user);
            var err = new Error('Wrong email or password.');
            err.status = 401;
            res.render('noUser');
        } else if (userId == sessionId) {

            console.log("ty");
            res.render('edittablePenggapai', {
                loginStatus: { state: "Logout", url: "logout" },
                picture: user.picture,
                name: user.name,
                gender: user.gender,
                telephoneNumber: user.phoneNumber,
                address: user.address,
                areaOfActivity: user.areaOfActivity,
                comment: user.comment
            });
        } else {
            console.log("qwerty");
            res.render('penggapai', {
                loginStatus: { state: "Login", url: "login" },
                picture: user.picture,
                name: user.name,
                gender: user.gender,
                telephoneNumber: user.phoneNumber,
                address: user.address,
                areaOfActivity: user.areaOfActivity,
                comment: user.comment
            });
        }


    });



});

module.exports = router;