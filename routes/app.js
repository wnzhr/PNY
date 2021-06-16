const express = require('express');
const router = express.Router();

// GET - render the home/index page

router.get('/', (req, res) => {
    res.render('index');
});

// GET - render the login page by clicking the login button in homepage
router.get('/login', (req, res) => {
    res.render('login');
});

// GET - render registration page after Penggapai clicks on "Register Here" from login page
router.get('/registration', (req, res) => {
    res.render('registration');
});

// GET - render validation page after registration success
router.get('/validation', (req, res) => {
    res.render('validation');
});


router.get('/logout', function (req, res, next) {
    if (req.session) {
        console.log("deleting the session of " + req.session.userId);
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                console.log("deleted req.session")
                /*" res.redirect?" 😀 😼 🐻 is that the same as rendering? Well why don't you try 
                res.render('index') down below 🧁 🍩 🍡". When should we simpley re-direct 
                and when should we render? */
                return res.redirect('/');
            }
        });
    }
});


module.exports = router;