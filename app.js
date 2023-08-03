if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

// console.log(process.env.SECRET) 

const express = require('express')
const app = express();
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
//------------ ROUTES ----------------------------------------------
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes= require("./routes/reviews")
const userRoutes = require("./routes/users")

// -------------------------------------------------------------------
const session = require("express-session")
const flash = require("connect-flash")
const Joi = require("joi");
const { campgroundSchema, reviewSchema} = require('./schemas');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local'); // authentication
const User = require('./models/user');
app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const { validate } = require('./models/campground');

// ------------------------- COONECTING TO MONGODB ------------------------
mongoose.connect('mongodb://localhost:27017/yelp-camp' , { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
// ------------------------------------------------------------------------------    
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));


// -------------------- SESSIONS ----------------------
const sessionConfig = {
    secret: 'shhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: true,
    //store: mongo /// storing data to cloud....restore the data even if we stop the server
    cookie: {
        httpOnly: true,
        // expires: Date.now() + 1000*60*60*24*7,
        // maxAge: 1000*60*60*24*7
    }
}

// ------------- VALIDATION USING JOI...INSIDE SCHEMA.JS ------------


app.use(session(sessionConfig))
app.use(flash());

// -------------------- AUTHENTICATION KE LIYE -----------------------
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// -------------------- DEMO: REGISTERING A USER...NO FORM------------------

app.get('/fakeUser', async(req,res) => {
    const user = new User({email: 'sakshidwivedi13@gmail.com', username: "sakshi"})
    const newUser = await User.register(user,"pickaboo");
    res.send(newUser);
})

// -------------------------- ROUTES FROM CAMPGROUNDS and REVIEWS ---------------------------

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// -------------------------- ROUTES FOR REVIEWS SCHEMA ADDED------------------
// har ek campground ke liye review post hoga.....
app.use("/",userRoutes); 
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews",reviewRoutes);


app.get('/', (req,res) => {
    res.render('campgrounds/home')
});






// ------------------- ERROR HANDELING -------------------------------


app.all('*',(req,res,next) => {
    next(new ExpressError("Page not found", 404))
})
app.use((err,req,res,next) => {
    const {statusCode = 500, message = "Something went wrong"} = err;
    if(!err.message) err.message='Oh no something went wrong'
    res.status(statusCode).render('error',{err});
    res.send('something went wrong');
})



app.listen(8080, () => {
    console.log("APP IS LISTENING ON PORT 8080!")
})