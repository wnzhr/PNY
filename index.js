const express = require('express');
const app = express();

//declare port
const PORT = process.env.PORT || 1337;

//declare path
const path = require('path');

//set views folder and view engine
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

//Serve static files
app.use(express.static('public'));

//use urlencoder for parsing request body
app.use(express.urlencoded({
    extended: true
}));

//database shit
const mongoose = require('mongoose');
const db = require('./config/keys.js').MongoURI;
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

//sessions stuff

const session = require('cookie-session');
app.use(session({
    secret: 'Planet earth',
    resave: true,
    saveUninitialized: false
}));

// make user ID available in templates
app.use(function (req, res, next) {
    res.locals.currentUser = req.session.userId;
    next();
});
//routes
const router = require('./routes/app.js');
app.use('/', router);
const users = require('./routes/protected.js');
app.use('/users', users);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));