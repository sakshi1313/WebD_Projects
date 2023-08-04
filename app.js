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


const db_url = process.env.DB_URL


//------------ ROUTES ----------------------------------------------
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes= require("./routes/reviews")
const userRoutes = require("./routes/users")

//--------------------- for security ----------------------
const helmet = require('helmet')

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

// ------- MONGO SANITIZE-----------------

const mongoSanitize = require('express-mongo-sanitize')

// --------------------------------------------------
app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const { validate } = require('./models/campground');

// app.use(helmet({contentSecurityPolicy: false }))


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",

];
const fontSrcUrls = [];










//------------------------- using helmet for security-----------------------------------
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmhzjbuis/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://png.pngtree.com/background/20230519/original/pngtree-night-camping-on-a-grassy-pasture-picture-image_2650533.jpg",
                "https://cdn.wallpapersafari.com/74/45/Tm67Ja.jpg",
                "https://cdn.wallpapersafari.com/74/45/Tm67Ja.jpg",
                "https://png.pngtree.com/background/20230518/original/pngtree-people-in-the-countryside-around-a-campfire-in-the-night-picture-image_2647056.jpg",

            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// ------------------------- COONECTING TO MONGODB ------------------------
// mongodb://localhost:27017/yelp-camp
mongoose.connect("mongodb://localhost:27017/yelp-camp" , { 
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

app.use(mongoSanitize({
    replaceWith: '_'
}))


// -------------------- SESSIONS ----------------------
const sessionConfig = {
    name: "mycookie",
    secret: 'shhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: true,
    //store: mongo /// storing data to cloud....restore the data even if we stop the server
    cookie: {
        httpOnly: true, // only accessible over http not js
        // secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
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
    console.log(req.query)
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